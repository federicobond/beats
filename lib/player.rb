class Player

  class Error < StandardError; end
  class ConnectionError < Error; end

  class << self
    attr_accessor :host
    attr_accessor :port
  end

  def self.setup
    yield self
  end

  def self.current
    @current ||= Player.new(host: host, port: port)
  end

  def initialize(options)
    @mpd = MPD.new(options[:host], options[:port])
    setup_callbacks
  end

  def setup_callbacks
    setup_mpd_callbacks
    setup_websocket_callbacks
  end

  def client
    @client ||= Faye::Client.new('http://localhost:9292/faye')
  end

  def publish(data)
    client.publish("/events", data)
  end

  def setup_mpd_callbacks
    events = [:volume, :repeat, :random, :single, :consume, :playlistlength,
              :state, :song, :time, :xfade, :mixrampdb, :mixrampdelay,
              :updating_db, :connection]

    events.each do |event|
      case event
      when :song
        @mpd.on event do |song|
          publish(:song => Song.new(song).to_h)
        end
      when :songid
        @mpd.on event do |songid|
          publish(:song => Song.new(song_with_id(songid)).to_h)
        end
      else
        @mpd.on event do |value|
          publish(event => value)
        end
      end
    end
  end

  def setup_websocket_callbacks
    subscription = client.subscribe("/events") do |message|
      if message.include?("request")
        request = message.delete("request")
        request_handler(request)
      elsif message.include?("command")
        args = message["command"]
        command = args.delete("name")
        command_handler(command, args)
      end
    end

    subscription.callback do
      puts "[SUBSCRIBE SUCCEEDED]"
    end
    subscription.errback do |error|
      puts "[SUBSCRIBE FAILED] #{error.inspect}"
    end

    client.bind 'transport:down' do
      puts "[CONNECTION DOWN]"
    end
    client.bind 'transport:up' do
      puts "[CONNECTION UP]"
    end
  end

  def request_handler(request, args={})
    case request
    when "current_song"
      song = nil
      song = current_song.to_h unless current_song.nil?
      publish(song: song)
    when "current_state"
      publish(state: state)
    end
  end

  def command_handler(command, args={})
    case command
    when "play"
      if args.include?("song")
        clear
        add(args["song"])
      end
      play
    when "add"
      song = args["song"]
      add(song)
    when "pause"
      self.pause = true
    when "volume"
      self.volume = args["value"].to_i
    when "random"
      self.random = !!args["value"]
    when "repeat"
      self.repeat = !!args["value"]
    end
  end

  def current_song
    song = mpd.current_song
    return nil if song.nil?
    Song.new(mpd.current_song)
  end

  def random(count=12)
    mpd.songs.shuffle[0, count].map(&Song)
    # mpd.songs[678, count].map(&Song)
  end

  def playlists
    mpd.playlists.map(&Playlist)
  end

  def playlist_by_name(name)
    playlists.detect { |p| p.name = name }
  end

  def search(q, field=:any, options={})
    mpd.search(field, q, options).map(&Song)
  end

  def method_missing(method, *args, &block)
    mpd.send(method, *args, &block)
  end

  def state
    status[:state]
  end

private
  def mpd
    @mpd.connect(true) unless @mpd.connected?
    @mpd
  end
end

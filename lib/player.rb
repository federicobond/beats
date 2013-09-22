class Player

  class Error < StandardError; end
  class ConnectionError < Error; end

  mc = class << self; self; end
  mc.send(:attr_accessor, :host)
  mc.send(:attr_accessor, :port)

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

  def setup_mpd_callbacks
    events = [:volume, :repeat, :random, :single, :consume, :playlistlength,
              :state, :song, :time, :xfade, :mixrampdb, :mixrampdelay,
              :updating_db, :connection]

    events.each do |event|
      case event
      when :song
        @mpd.on event do |song|
          client.publish("/events", {
            :song => Song.new(song).to_json
          })
        end
      when :songid
        @mpd.on event do |songid|
          client.publish("/events", {
            :song => Song.new(@mpd.song_with_id(songid)).to_json
          })
        end
      else
        @mpd.on event do |value|
          client.publish("/events", {event => value})
        end
      end
    end
  end

  def setup_websocket_callbacks
    subscription = client.subscribe("/events") do |message|
      if message.include?("request")
        if message["request"] == "current_song"
          song = mpd.current_song
          song = Song.new(song).to_json unless song.nil?
          client.publish("/events", {song: song})

        elsif message["request"] == "current_state"
          state = mpd.status[:state]
          client.publish("/events", {state: state})
        end
      elsif message.include?("command")
        command = message["command"]
        case command["name"]
        when "play"
          if command.include?("song")
            song = command["song"]
            mpd.clear
            mpd.add(song)
          end
          mpd.play
        when "add"
          song = command["song"]
          mpd.add(song)
        when "pause"
          mpd.pause = true
        when "volume"
          mpd.volume = command["value"].to_i
        when "random"
          mpd.random = !!command["value"]
        when "repeat"
          mpd.repeat = !!command["value"]
        end
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

private
  def mpd
    @mpd.connect(true) unless @mpd.connected?
    @mpd
  end
end

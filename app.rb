require "rack"
require "rack/protection"
require "cuba"
require "cuba/contrib"
require "faye"
require "ruby-mpd"
require "json"
require "yaml"
require "ostruct"

require_relative "./lib/song"
require_relative "./lib/playlist"
require_relative "./lib/album_covers"
require_relative "./lib/player"

settings = YAML.load_file("config/settings.yml")

Player.setup do |config|
  config.host = settings["mpd"]["host"]
  config.port = settings["mpd"]["port"]
end
  
AlbumCovers.setup

Faye::WebSocket.load_adapter('thin')
Cuba.use Faye::RackAdapter, :mount => "/faye"

Cuba.use Rack::Static,
  :urls => ["/css", "/img", "/js", "/fonts"],
  :root => "public"
Cuba.use Rack::Session::Cookie, :secret => "__a_very_long_string__"
Cuba.use Rack::Protection
Cuba.use Rack::Protection::RemoteReferrer

Cuba.plugin Cuba::Prelude
Cuba.plugin Cuba::Mote

Cuba.define do
  player = Player.current

  def page
    @page ||= {}
  end

  def page_id
    return page[:id] if page[:id]
    id = req.path[1..-1].split("/").first
    return "page-" + (id.nil? ? "index" : id)
  end

  def not_found
    res.status = 404
    render("not_found")
  end

  on get, root do
    current_song = player.current_song
    render("index", {current_song: current_song})
  end

  on get, "discover" do
    render("discover", {songs: player.random})
  end

  on get, "people" do
    users = Array.new(5) do
      OpenStruct.new(
        name: "Federico Bond",
        position: "Developer",
        gravatar: "http://gravatar.com/avatar/bbdec1b1d45fbb9d13f02dc5e678bf0e?size=120",
      )
    end
    render("people", {users: users})
  end

  on get, "playlists" do
    playlists = player.playlists
    ctx = {
      playlists: playlists,
      playlist: nil,
      current_count: player.queue.count
    }

    on param("name") do |name|
      playlist = player.playlist_by_name(name)
      render("playlists", ctx.update(
        playlist: playlist,
        songs: playlist.songs
      ))
    end

    on default do
      render("playlists", ctx.update(songs: player.queue))
    end
  end

  on get, "search" do
    on param("q") do |q|
      on param("scope") do |scope|
        if %w[any title artist album].include?(scope)
          songs = player.search(q, scope.to_sym)
          render("search", {query: q, songs: songs, scope: scope})
        else
          raise Exception.new("Invalid search scope")
        end
      end

      on default do
        songs = player.search(q)
        render("search", {query: q, songs: songs})
      end
    end

    on default do
      render("search")
    end
  end

  on get, "settings" do
    render("settings", {
      volume: player.volume,
      random: player.random?,
      repeat: player.repeat?,
    })
  end

  on get, "about" do
    render("about")
  end

  on default do
    not_found
  end
end

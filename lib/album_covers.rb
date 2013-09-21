require "open-uri"
require "rexml/document"
require "uri"
require "json"
require "sequel"

module AlbumCovers
  def self.setup
    SQLiteCache.setup
  end

  def self.current
    @current ||= SQLiteCache.new(Lastfm.new)
  end

  class Lastfm
    API_URL = "http://ws.audioscrobbler.com/2.0/?"
  
    def cover(song)
      begin
        url = API_URL + URI.encode_www_form({
          method: "album.getinfo",
          api_key: "505a44b294e7ceb43e31411a650ecd22",
          album: song.album,
          artist: song.artist,
          format: "json",
        })
        json = JSON.parse(open(url).read)
        return nil if json.include?("error")
        
        images = json["album"]["image"].map { |n| [n["size"], n["#text"]] }
        images.detect { |i| %w{large extralarge}.include?(i.first) }.last
      rescue SocketError
        return nil
      end
    end
  end

  class SQLiteCache
    DATABASE = "data/beats.db"

    def self.setup
      @db = Sequel.sqlite(DATABASE)
      @db.create_table? :covers do
        primary_key :id
        String :artist
        String :album
        String :url
      end
    end

    def self.db
      return @db
    end

    def db
      self.class.db
    end

    def initialize(service)
      @service = service
    end

    def cover(song)
      covers = db[:covers]
      params = {:artist => song.artist, :album => song.album}
      cover = covers.where(params).first
      if cover.nil?
        url = @service.cover(song)
        covers.insert(params.update(:url => url)) unless url.nil?
        return url
      end
      cover[:url]
    end
  end
end

# require "ostruct"
# service = AlbumCovers::Lastfm.new
# puts service.cover(OpenStruct.new({album: "Abbey Road", artist: "The Beatles"}))

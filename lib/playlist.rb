class Playlist
  def self.to_proc
    Proc.new { |s| new(s) }
  end

  def initialize(playlist)
    raise ArgumentError if playlist.nil?
    @playlist = playlist
  end

  def to_json
    {
      name: name,
      songs: songs.map(&:to_json)
    }
  end

  def songs
    @playlist.songs.map(&Song)
  end

  def count
    songs.count
  end

  def ==(other)
    other && name == other.name
  end

  def method_missing(method, *args, &block)
    @playlist.send(method, *args, &block)
  end
end

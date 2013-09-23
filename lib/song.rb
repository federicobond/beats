class Song
  def self.to_proc
    Proc.new { |s| new(s) }
  end

  def initialize(song)
    raise ArgumentError if song.nil?
    @song = song
  end

  def to_h
    {
      title: title,
      artist: artist,
      album: album,
      image: image,
      time: time
    }
  end

  def image
    AlbumCovers.current.cover(self)
  end

  def method_missing(method, *args, &block)
    @song.send(method, *args, &block)
  end
end

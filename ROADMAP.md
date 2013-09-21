Priority
========

 * Highlight current song in queue
 * Enable playing other songs from queue without wiping it out
 * Show complete albums in Discover page
 * Provide feedback in song buttons when song is playing
 * Keep current queue updated via using `playlistid` event
 * Persistent playback controls and indicators
 * Drag and drop songs from the queue (#move, #swap)
 * Add all songs from artist or album
 * Use data bindings to keep client-side interface updated (checkout how Angular does it)
 * Persist settings in UI (populating them server side)
 * JS: Use controlers to define responsabilities. Each page with code should be handled by a controller
 * Load songs lazily on scroll for long lists (either infinite scroll o More button)
 * Update database button (in settings?)
 * Improve styles (aim to be the most beautiful MPD web client out there)

Nice to haves
=============

 * Music browser (#artists, #albums)
 * Improve backend interfaces and remove forwarding
 * Growl style notifications
 * Cache album images locally (and convert to appropiate size)
 * Build initial album cover cache from id3 tags in songs
 * Preload album image before song changes
 * Playlist saving
 * Authentication and sessions
    * People page
    * Ability to "Like" songs (and playlists?)
    * Music Newsfeed

YouDown.VideoFormat = Em.Object.extend({
  audio: Em.computed.equal('vcodec', 'none'),
  dashVideo: Em.computed.equal('format_note', 'DASH video')
});
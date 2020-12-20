const fs = require('fs');

class Resumer {
  constructor(tmpFolder) {
    this.temporaryFolder = tmpFolder;
    this.maxFileSize = null;
    this.fileParameterName = 'file';

    try {
      fs.mkdirSync(this.temporaryFolder);
    } catch (e) {
      // TODO: Catch failures
    }
  }

  cleanIdentifier(identifier) {
    return identifier.replace(/^0-9A-Za-z_-/gim, '');
  }

  async upload({ files = [], body }) {
    const chunkNumber = body['resumableChunkNumber'];
    const chunkSize = body['resumableChunkSize'];
    const totalSize = body['resumableTotalSize'];
    const identifier = this.cleanIdentifier(body['resumableIdentifier']);
    const filename = body['resumableFilename'];

    console.log('>>>>> Details: ', {
      chunkNumber,
      chunkSize,
      totalSize,
      identifier,
      filename,
      files,
    });

    return 201;
  }
}

module.exports = Resumer;

const fs = require('fs');
const path = require('path');
const util = require('util');

const asyncOpen = util.promisify(fs.open);
const asyncReadFile = util.promisify(fs.readFile);
const asyncWrite = util.promisify(fs.write);
const asyncRename = util.promisify(fs.rename);
const asyncStat = util.promisify(fs.stat);

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

  getChunkFilename(chunkNumber, identifier, extension) {
    // Clean up the identifier
    identifier = this.cleanIdentifier(identifier);
    // What would the file name be?
    return path.join(
      this.temporaryFolder,
      `./blob-${identifier}.${extension}.${chunkNumber}`,
    );
  }

  cleanIdentifier(identifier) {
    return identifier.replace(/^0-9A-Za-z_-/gim, '');
  }

  async save(totalChunks, identifier, extension) {
    const outFileName = path.join(
      this.temporaryFolder,
      `${identifier}.${extension}`,
    );
    const outFile = await asyncOpen(outFileName, 'w');
    let lastChunkSize = 0;
    console.log('>>>>> Out File Descriptior Before Save', outFile);
    for (let iChunk = 1; iChunk <= totalChunks; iChunk++) {
      const chunkName = this.getChunkFilename(iChunk, identifier, extension);
      try {
        let buffer = await asyncReadFile(chunkName);
        await asyncWrite(outFile, buffer, 0, buffer.length, lastChunkSize);
        lastChunkSize += buffer.byteLength;
        console.log('>>>>> File Chunk save Success', lastChunkSize);
      } catch (e) {
        // TODO
        console.log('>>>>>> File Save Error: ', e);
      }
    }
  }

  async upload({ file, body }) {
    const chunkNumber = body['resumableChunkNumber'];
    const chunkSize = body['resumableChunkSize'];
    const totalSize = body['resumableTotalSize'];
    const identifier = this.cleanIdentifier(body['resumableIdentifier']);
    // const filename = body['resumableFilename'];
    let extension = file.originalname.match(/.*\.([a-zA-Z0-9]{2,5})/);

    extension = extension ? extension[1] : '';

    // console.log('>>>>> Details: ', {
    //   chunkNumber,
    //   chunkSize,
    //   totalSize,
    //   identifier,
    //   file,
    // });

    const chunkName = this.getChunkFilename(chunkNumber, identifier, extension);

    try {
      await asyncRename(file.path, chunkName);
      /**
       * @returns {Promise<number>}
       */
      return (() => {
        let currentTestChunk = 1;
        const numberOfChunks = Math.max(
          Math.floor(totalSize / (chunkSize * 1.0)),
          1,
        );
        const testChunkExists = async () => {
          try {
            await asyncStat(
              this.getChunkFilename(currentTestChunk, identifier, extension),
            );
            currentTestChunk++;
            if (currentTestChunk > numberOfChunks) {
              currentTestChunk = 1;
              await this.save(numberOfChunks, identifier, extension);
              return Promise.resolve(201);
            } else {
              if (chunkNumber > currentTestChunk) {
                // This check does not always succeed, as chunks
                // received can be in any order, but this does help to
                // reduce the number of times recursion happens
                return Promise.resolve(201);
              }
              return testChunkExists();
            }
          } catch (e) {
            // Only possible reason this fails, is due to chunk not found
            // which is totally acceptable
            return Promise.reject(201);
          }
        };
        return testChunkExists();
      })();
    } catch (e) {
      console.error('>>>>>> Rename Error: ', e);
      return Promise.reject(422);
    }
  }
}

module.exports = Resumer;

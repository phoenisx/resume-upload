import {
  ConfigurationHash as Stale,
  Resumable as StateResumable,
  ResumableFile as StaleResumableFile
} from "resumablejs";

declare module Resumable  {
  export interface ConfigurationHash extends Stale {
    throttleProgressCallbacks: number;
  }

  export class Resumable extends StateResumable {
    constructor(options: ConfigurationHash);
  }

  export interface ResumableFile extends StaleResumableFile {}
}

declare module 'resumablejs' {
  export = Resumable.Resumable;
}

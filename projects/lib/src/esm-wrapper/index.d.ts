import { Version } from '@angular/core';
import { Options, Ora } from 'ora';

export declare const getAngularVersionFromEsm: () => Promise<Version>;
export declare const getOraFromEsm: (options?: string | Options) => Promise<Ora>;

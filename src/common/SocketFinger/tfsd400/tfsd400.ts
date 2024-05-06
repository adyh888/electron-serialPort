import { FingerConf } from '../../../interface/finger-conf.interface'
import { TfsD400Basic } from './tfsd400-basic'

export class TfsD400 extends TfsD400Basic {
  constructor(fingerConf: FingerConf) {
    super(fingerConf)
  }

  async fingerprintEntry(num: number) {
    this.record(num)
  }

  async fingerprintDelete(num: number) {
    this.deleteSingle(num)
  }

  async fingerprintClear() {
    this.deleteAll()
  }

  async fingerprintRestart() {
    this.compareOneToMore()
  }
}

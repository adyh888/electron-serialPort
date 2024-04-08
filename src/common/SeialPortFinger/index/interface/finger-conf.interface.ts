export interface FingerConf {
  host?: string
  port?: number
  switch?: boolean
  supplier?: number
  deviceId?: string
  baudRate?: number
  path?: string
  serverIndex?: number
}

export enum FingerSupplier {
  zdyz, //正点原子
  wx //微雪
}

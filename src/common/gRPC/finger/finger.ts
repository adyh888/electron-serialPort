export interface GetEmptyRequest {
}

export function encodeGetEmptyRequest(message: GetEmptyRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetEmptyRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetEmptyRequest(message: GetEmptyRequest, bb: ByteBuffer): void {
}

export function decodeGetEmptyRequest(binary: Uint8Array): GetEmptyRequest {
  return _decodeGetEmptyRequest(wrapByteBuffer(binary));
}

function _decodeGetEmptyRequest(bb: ByteBuffer): GetEmptyRequest {
  let message: GetEmptyRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetUrlRequest {
  url?: string;
}

export function encodeGetUrlRequest(message: GetUrlRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetUrlRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetUrlRequest(message: GetUrlRequest, bb: ByteBuffer): void {
  // optional string url = 1;
  let $url = message.url;
  if ($url !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $url);
  }
}

export function decodeGetUrlRequest(binary: Uint8Array): GetUrlRequest {
  return _decodeGetUrlRequest(wrapByteBuffer(binary));
}

function _decodeGetUrlRequest(bb: ByteBuffer): GetUrlRequest {
  let message: GetUrlRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string url = 1;
      case 1: {
        message.url = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetUrlDeviceIdRequest {
  url?: string;
  deviceId?: string;
}

export function encodeGetUrlDeviceIdRequest(message: GetUrlDeviceIdRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetUrlDeviceIdRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetUrlDeviceIdRequest(message: GetUrlDeviceIdRequest, bb: ByteBuffer): void {
  // optional string url = 1;
  let $url = message.url;
  if ($url !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $url);
  }

  // optional string deviceId = 2;
  let $deviceId = message.deviceId;
  if ($deviceId !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $deviceId);
  }
}

export function decodeGetUrlDeviceIdRequest(binary: Uint8Array): GetUrlDeviceIdRequest {
  return _decodeGetUrlDeviceIdRequest(wrapByteBuffer(binary));
}

function _decodeGetUrlDeviceIdRequest(bb: ByteBuffer): GetUrlDeviceIdRequest {
  let message: GetUrlDeviceIdRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string url = 1;
      case 1: {
        message.url = readString(bb, readVarint32(bb));
        break;
      }

      // optional string deviceId = 2;
      case 2: {
        message.deviceId = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetFnoRequest {
  fno?: number;
}

export function encodeGetFnoRequest(message: GetFnoRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetFnoRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetFnoRequest(message: GetFnoRequest, bb: ByteBuffer): void {
  // optional uint32 fno = 1;
  let $fno = message.fno;
  if ($fno !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $fno);
  }
}

export function decodeGetFnoRequest(binary: Uint8Array): GetFnoRequest {
  return _decodeGetFnoRequest(wrapByteBuffer(binary));
}

function _decodeGetFnoRequest(bb: ByteBuffer): GetFnoRequest {
  let message: GetFnoRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 fno = 1;
      case 1: {
        message.fno = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetFeatureRequest {
  feature?: string;
}

export function encodeGetFeatureRequest(message: GetFeatureRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetFeatureRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetFeatureRequest(message: GetFeatureRequest, bb: ByteBuffer): void {
  // optional string feature = 1;
  let $feature = message.feature;
  if ($feature !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $feature);
  }
}

export function decodeGetFeatureRequest(binary: Uint8Array): GetFeatureRequest {
  return _decodeGetFeatureRequest(wrapByteBuffer(binary));
}

function _decodeGetFeatureRequest(bb: ByteBuffer): GetFeatureRequest {
  let message: GetFeatureRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string feature = 1;
      case 1: {
        message.feature = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetFnoFeatureRequest {
  fno?: number;
  feature?: string;
}

export function encodeGetFnoFeatureRequest(message: GetFnoFeatureRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetFnoFeatureRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetFnoFeatureRequest(message: GetFnoFeatureRequest, bb: ByteBuffer): void {
  // optional uint32 fno = 1;
  let $fno = message.fno;
  if ($fno !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $fno);
  }

  // optional string feature = 2;
  let $feature = message.feature;
  if ($feature !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $feature);
  }
}

export function decodeGetFnoFeatureRequest(binary: Uint8Array): GetFnoFeatureRequest {
  return _decodeGetFnoFeatureRequest(wrapByteBuffer(binary));
}

function _decodeGetFnoFeatureRequest(bb: ByteBuffer): GetFnoFeatureRequest {
  let message: GetFnoFeatureRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 fno = 1;
      case 1: {
        message.fno = readVarint32(bb) >>> 0;
        break;
      }

      // optional string feature = 2;
      case 2: {
        message.feature = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetRecordUserRequest {
  url?: string;
  deviceId?: string;
  uid?: number;
}

export function encodeGetRecordUserRequest(message: GetRecordUserRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetRecordUserRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetRecordUserRequest(message: GetRecordUserRequest, bb: ByteBuffer): void {
  // optional string url = 1;
  let $url = message.url;
  if ($url !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $url);
  }

  // optional string deviceId = 2;
  let $deviceId = message.deviceId;
  if ($deviceId !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $deviceId);
  }

  // optional uint32 uid = 3;
  let $uid = message.uid;
  if ($uid !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $uid);
  }
}

export function decodeGetRecordUserRequest(binary: Uint8Array): GetRecordUserRequest {
  return _decodeGetRecordUserRequest(wrapByteBuffer(binary));
}

function _decodeGetRecordUserRequest(bb: ByteBuffer): GetRecordUserRequest {
  let message: GetRecordUserRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string url = 1;
      case 1: {
        message.url = readString(bb, readVarint32(bb));
        break;
      }

      // optional string deviceId = 2;
      case 2: {
        message.deviceId = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 uid = 3;
      case 3: {
        message.uid = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Res {
  result?: string;
  error?: string;
}

export function encodeRes(message: Res): Uint8Array {
  let bb = popByteBuffer();
  _encodeRes(message, bb);
  return toUint8Array(bb);
}

function _encodeRes(message: Res, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional string error = 2;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $error);
  }
}

export function decodeRes(binary: Uint8Array): Res {
  return _decodeRes(wrapByteBuffer(binary));
}

function _decodeRes(bb: ByteBuffer): Res {
  let message: Res = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional string error = 2;
      case 2: {
        message.error = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResData {
  result?: string;
  error?: string;
  data?: ServiceInfo[];
}

export function encodeResData(message: ResData): Uint8Array {
  let bb = popByteBuffer();
  _encodeResData(message, bb);
  return toUint8Array(bb);
}

function _encodeResData(message: ResData, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional string error = 2;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $error);
  }

  // repeated ServiceInfo data = 3;
  let array$data = message.data;
  if (array$data !== undefined) {
    for (let value of array$data) {
      writeVarint32(bb, 26);
      let nested = popByteBuffer();
      _encodeServiceInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeResData(binary: Uint8Array): ResData {
  return _decodeResData(wrapByteBuffer(binary));
}

function _decodeResData(bb: ByteBuffer): ResData {
  let message: ResData = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional string error = 2;
      case 2: {
        message.error = readString(bb, readVarint32(bb));
        break;
      }

      // repeated ServiceInfo data = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        let values = message.data || (message.data = []);
        values.push(_decodeServiceInfo(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ServiceInfo {
  deviceId?: string;
  deviceName?: string;
  fingerIp?: string;
  ping?: string;
  port?: string;
  status?: string;
}

export function encodeServiceInfo(message: ServiceInfo): Uint8Array {
  let bb = popByteBuffer();
  _encodeServiceInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeServiceInfo(message: ServiceInfo, bb: ByteBuffer): void {
  // optional string deviceId = 1;
  let $deviceId = message.deviceId;
  if ($deviceId !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $deviceId);
  }

  // optional string deviceName = 2;
  let $deviceName = message.deviceName;
  if ($deviceName !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $deviceName);
  }

  // optional string fingerIp = 3;
  let $fingerIp = message.fingerIp;
  if ($fingerIp !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $fingerIp);
  }

  // optional string ping = 4;
  let $ping = message.ping;
  if ($ping !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $ping);
  }

  // optional string port = 5;
  let $port = message.port;
  if ($port !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $port);
  }

  // optional string status = 6;
  let $status = message.status;
  if ($status !== undefined) {
    writeVarint32(bb, 50);
    writeString(bb, $status);
  }
}

export function decodeServiceInfo(binary: Uint8Array): ServiceInfo {
  return _decodeServiceInfo(wrapByteBuffer(binary));
}

function _decodeServiceInfo(bb: ByteBuffer): ServiceInfo {
  let message: ServiceInfo = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string deviceId = 1;
      case 1: {
        message.deviceId = readString(bb, readVarint32(bb));
        break;
      }

      // optional string deviceName = 2;
      case 2: {
        message.deviceName = readString(bb, readVarint32(bb));
        break;
      }

      // optional string fingerIp = 3;
      case 3: {
        message.fingerIp = readString(bb, readVarint32(bb));
        break;
      }

      // optional string ping = 4;
      case 4: {
        message.ping = readString(bb, readVarint32(bb));
        break;
      }

      // optional string port = 5;
      case 5: {
        message.port = readString(bb, readVarint32(bb));
        break;
      }

      // optional string status = 6;
      case 6: {
        message.status = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResMsg {
  result?: string;
  error?: string;
  msg?: string;
}

export function encodeResMsg(message: ResMsg): Uint8Array {
  let bb = popByteBuffer();
  _encodeResMsg(message, bb);
  return toUint8Array(bb);
}

function _encodeResMsg(message: ResMsg, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional string error = 2;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $error);
  }

  // optional string msg = 3;
  let $msg = message.msg;
  if ($msg !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $msg);
  }
}

export function decodeResMsg(binary: Uint8Array): ResMsg {
  return _decodeResMsg(wrapByteBuffer(binary));
}

function _decodeResMsg(bb: ByteBuffer): ResMsg {
  let message: ResMsg = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional string error = 2;
      case 2: {
        message.error = readString(bb, readVarint32(bb));
        break;
      }

      // optional string msg = 3;
      case 3: {
        message.msg = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResRecordMsg {
  result?: string;
  fno?: number;
  right?: number;
  feature?: string;
  msg?: string;
  length?: number;
  error?: string;
}

export function encodeResRecordMsg(message: ResRecordMsg): Uint8Array {
  let bb = popByteBuffer();
  _encodeResRecordMsg(message, bb);
  return toUint8Array(bb);
}

function _encodeResRecordMsg(message: ResRecordMsg, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional uint32 fno = 2;
  let $fno = message.fno;
  if ($fno !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $fno);
  }

  // optional uint32 right = 3;
  let $right = message.right;
  if ($right !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $right);
  }

  // optional string feature = 4;
  let $feature = message.feature;
  if ($feature !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $feature);
  }

  // optional string msg = 5;
  let $msg = message.msg;
  if ($msg !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $msg);
  }

  // optional uint32 length = 6;
  let $length = message.length;
  if ($length !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $length);
  }

  // optional string error = 7;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 58);
    writeString(bb, $error);
  }
}

export function decodeResRecordMsg(binary: Uint8Array): ResRecordMsg {
  return _decodeResRecordMsg(wrapByteBuffer(binary));
}

function _decodeResRecordMsg(bb: ByteBuffer): ResRecordMsg {
  let message: ResRecordMsg = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 fno = 2;
      case 2: {
        message.fno = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 right = 3;
      case 3: {
        message.right = readVarint32(bb) >>> 0;
        break;
      }

      // optional string feature = 4;
      case 4: {
        message.feature = readString(bb, readVarint32(bb));
        break;
      }

      // optional string msg = 5;
      case 5: {
        message.msg = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 length = 6;
      case 6: {
        message.length = readVarint32(bb) >>> 0;
        break;
      }

      // optional string error = 7;
      case 7: {
        message.error = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResVersion {
  result?: string;
  version?: string;
}

export function encodeResVersion(message: ResVersion): Uint8Array {
  let bb = popByteBuffer();
  _encodeResVersion(message, bb);
  return toUint8Array(bb);
}

function _encodeResVersion(message: ResVersion, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional string version = 2;
  let $version = message.version;
  if ($version !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $version);
  }
}

export function decodeResVersion(binary: Uint8Array): ResVersion {
  return _decodeResVersion(wrapByteBuffer(binary));
}

function _decodeResVersion(bb: ByteBuffer): ResVersion {
  let message: ResVersion = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional string version = 2;
      case 2: {
        message.version = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResTotal {
  result?: string;
  total?: number;
}

export function encodeResTotal(message: ResTotal): Uint8Array {
  let bb = popByteBuffer();
  _encodeResTotal(message, bb);
  return toUint8Array(bb);
}

function _encodeResTotal(message: ResTotal, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional uint32 total = 2;
  let $total = message.total;
  if ($total !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $total);
  }
}

export function decodeResTotal(binary: Uint8Array): ResTotal {
  return _decodeResTotal(wrapByteBuffer(binary));
}

function _decodeResTotal(bb: ByteBuffer): ResTotal {
  let message: ResTotal = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 total = 2;
      case 2: {
        message.total = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResFno {
  result?: string;
  fno?: number;
  right?: number;
  error?: string;
}

export function encodeResFno(message: ResFno): Uint8Array {
  let bb = popByteBuffer();
  _encodeResFno(message, bb);
  return toUint8Array(bb);
}

function _encodeResFno(message: ResFno, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional uint32 fno = 2;
  let $fno = message.fno;
  if ($fno !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $fno);
  }

  // optional uint32 right = 3;
  let $right = message.right;
  if ($right !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $right);
  }

  // optional string error = 4;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $error);
  }
}

export function decodeResFno(binary: Uint8Array): ResFno {
  return _decodeResFno(wrapByteBuffer(binary));
}

function _decodeResFno(bb: ByteBuffer): ResFno {
  let message: ResFno = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 fno = 2;
      case 2: {
        message.fno = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 right = 3;
      case 3: {
        message.right = readVarint32(bb) >>> 0;
        break;
      }

      // optional string error = 4;
      case 4: {
        message.error = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResUserRight {
  result?: string;
  fno?: number;
  right?: number;
}

export function encodeResUserRight(message: ResUserRight): Uint8Array {
  let bb = popByteBuffer();
  _encodeResUserRight(message, bb);
  return toUint8Array(bb);
}

function _encodeResUserRight(message: ResUserRight, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional uint32 fno = 2;
  let $fno = message.fno;
  if ($fno !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $fno);
  }

  // optional uint32 right = 3;
  let $right = message.right;
  if ($right !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $right);
  }
}

export function decodeResUserRight(binary: Uint8Array): ResUserRight {
  return _decodeResUserRight(wrapByteBuffer(binary));
}

function _decodeResUserRight(bb: ByteBuffer): ResUserRight {
  let message: ResUserRight = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 fno = 2;
      case 2: {
        message.fno = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 right = 3;
      case 3: {
        message.right = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResUserInfo {
  result?: string;
  total?: number;
  data?: UserInfo[];
}

export function encodeResUserInfo(message: ResUserInfo): Uint8Array {
  let bb = popByteBuffer();
  _encodeResUserInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeResUserInfo(message: ResUserInfo, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional uint32 total = 2;
  let $total = message.total;
  if ($total !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $total);
  }

  // repeated UserInfo data = 3;
  let array$data = message.data;
  if (array$data !== undefined) {
    for (let value of array$data) {
      writeVarint32(bb, 26);
      let nested = popByteBuffer();
      _encodeUserInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeResUserInfo(binary: Uint8Array): ResUserInfo {
  return _decodeResUserInfo(wrapByteBuffer(binary));
}

function _decodeResUserInfo(bb: ByteBuffer): ResUserInfo {
  let message: ResUserInfo = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 total = 2;
      case 2: {
        message.total = readVarint32(bb) >>> 0;
        break;
      }

      // repeated UserInfo data = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        let values = message.data || (message.data = []);
        values.push(_decodeUserInfo(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface UserInfo {
  fno?: number;
  right?: number;
}

export function encodeUserInfo(message: UserInfo): Uint8Array {
  let bb = popByteBuffer();
  _encodeUserInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeUserInfo(message: UserInfo, bb: ByteBuffer): void {
  // optional uint32 fno = 1;
  let $fno = message.fno;
  if ($fno !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $fno);
  }

  // optional uint32 right = 2;
  let $right = message.right;
  if ($right !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $right);
  }
}

export function decodeUserInfo(binary: Uint8Array): UserInfo {
  return _decodeUserInfo(wrapByteBuffer(binary));
}

function _decodeUserInfo(bb: ByteBuffer): UserInfo {
  let message: UserInfo = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 fno = 1;
      case 1: {
        message.fno = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 right = 2;
      case 2: {
        message.right = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResFeature {
  result?: string;
  fno?: number;
  right?: number;
  feature?: string;
}

export function encodeResFeature(message: ResFeature): Uint8Array {
  let bb = popByteBuffer();
  _encodeResFeature(message, bb);
  return toUint8Array(bb);
}

function _encodeResFeature(message: ResFeature, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // optional uint32 fno = 2;
  let $fno = message.fno;
  if ($fno !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $fno);
  }

  // optional uint32 right = 3;
  let $right = message.right;
  if ($right !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $right);
  }

  // optional string feature = 4;
  let $feature = message.feature;
  if ($feature !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $feature);
  }
}

export function decodeResFeature(binary: Uint8Array): ResFeature {
  return _decodeResFeature(wrapByteBuffer(binary));
}

function _decodeResFeature(bb: ByteBuffer): ResFeature {
  let message: ResFeature = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 fno = 2;
      case 2: {
        message.fno = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 right = 3;
      case 3: {
        message.right = readVarint32(bb) >>> 0;
        break;
      }

      // optional string feature = 4;
      case 4: {
        message.feature = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ResFnoList {
  result?: string;
  fnoList?: number[];
  error?: string;
}

export function encodeResFnoList(message: ResFnoList): Uint8Array {
  let bb = popByteBuffer();
  _encodeResFnoList(message, bb);
  return toUint8Array(bb);
}

function _encodeResFnoList(message: ResFnoList, bb: ByteBuffer): void {
  // optional string result = 1;
  let $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $result);
  }

  // repeated uint32 fnoList = 2;
  let array$fnoList = message.fnoList;
  if (array$fnoList !== undefined) {
    let packed = popByteBuffer();
    for (let value of array$fnoList) {
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 18);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional string error = 3;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $error);
  }
}

export function decodeResFnoList(binary: Uint8Array): ResFnoList {
  return _decodeResFnoList(wrapByteBuffer(binary));
}

function _decodeResFnoList(bb: ByteBuffer): ResFnoList {
  let message: ResFnoList = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string result = 1;
      case 1: {
        message.result = readString(bb, readVarint32(bb));
        break;
      }

      // repeated uint32 fnoList = 2;
      case 2: {
        let values = message.fnoList || (message.fnoList = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional string error = 3;
      case 3: {
        message.error = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Long {
  low: number;
  high: number;
  unsigned: boolean;
}

interface ByteBuffer {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value: Long): string {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value: number): Long {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack: ByteBuffer[] = [];

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit;
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2: number, c3: number, c4: number, c: number;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0;
  let value = 0;
  let b: number;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b: number;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}

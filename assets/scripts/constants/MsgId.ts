import { _decorator } from 'cc';

void _decorator;

/** 消息 ID 定义。 */
export enum MsgId {
  LOGIN_REQ = 1001,
  LOGIN_RSP = 1002,
  HEARTBEAT_REQ = 1003,
  HEARTBEAT_RSP = 1004,
  RECONNECT_REQ = 1005,
  PLAYER_ACTION = 1101,
  PUSH_TABLE_STATE = 2001,
  PUSH_HOLE_CARDS = 2002,
  PUSH_DEAL = 2003,
  PUSH_TURN = 2004,
  PUSH_SHOWDOWN = 2005
}

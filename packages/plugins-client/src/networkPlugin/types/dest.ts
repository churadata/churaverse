/**
 * Messageの送信先. クライアントから送信した場合、サーバーには必ず送信される.
 *
 * ---
 *
 * |||
 * |-|-|
 * |onlyServer|サーバーにのみ送信し、クライアントには送信しない|
 * |onlySelf  |自分にのみに送信する. クライアントからのリクエストを受けたサーバーが返すMessageに用いる|
 * |allClients|自分を含めた全クライアントに送信する|
 * |others    |自分を除いた全クライアントに送信する|
 *
 */
export type Dest = 'onlyServer' | 'onlySelf' | 'allClients' | 'others'

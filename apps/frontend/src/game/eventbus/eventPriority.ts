export const EVENT_PRIORITY: { readonly [key in typeof EVENT_PRIORITY_NAME[number]]: key } = {
  HIGHEST: 'HIGHEST',
  HIGH: 'HIGH',
  NORMAL: 'NORMAL',
  LOW: 'LOW',
  LOWEST: 'LOWEST',
} as const

export const EVENT_PRIORITY_NAME = ['HIGHEST', 'HIGH', 'NORMAL', 'LOW', 'LOWEST'] as const

/**
 * subscribeEventで登録したcallbackの実行順の優先順位. HIGHESTが最初に実行され, LOWESTが最も最後に実行される.
 * EventPriorityが同じcallbackは先にsubscribeEventで登録した方から実行される
 */
export type EventPriority = typeof EVENT_PRIORITY_NAME[number]

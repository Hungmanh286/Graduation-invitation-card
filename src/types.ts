/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CongratsMessage {
  id: string;
  name: string;
  relation: 'student' | 'parent' | 'teacher' | 'friend' | 'other';
  message: string;
  sticker: 'cap' | 'flowers' | 'medal' | 'scroll' | 'heart';
  timestamp: string;
  likes: number;
}

export interface ScheduleItem {
  time: string;
  activity: string;
  details: string;
  category: 'formal' | 'academic' | 'break' | 'celebration';
}

export interface StudentSeat {
  studentId: string;
  name: string;
  major: string;
  block: string;
  row: string;
  seatNumber: string;
}

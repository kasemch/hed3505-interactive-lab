import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRegistration,validateRegistration,classifyEnrollment,INITIAL_REGISTRATION_STATE} from '../src/registration-state.js';
test('normalizes input without changing student ID',()=>assert.deepEqual(normalizeRegistration({name:'  ผู้เรียน   ทดลอง ',studentId:'00123456',email:' TEST@EXAMPLE.COM '}),{name:'ผู้เรียน ทดลอง',studentId:'00123456',email:'test@example.com'}));
test('accepts valid synthetic registration',()=>assert.equal(validateRegistration({name:'ผู้เรียน ทดลอง',studentId:'00123456',email:'test@example.com'}).valid,true));
test('rejects invalid identifiers and email',()=>assert.equal(validateRegistration({name:' ',studentId:'abc',email:'bad'}).valid,false));
test('returning subject reuses enrollment',()=>assert.equal(classifyEnrollment([{auth_subject:'subject-1',student_id:'00123456'}],{authSubject:'subject-1',studentId:'00123456',email:'test@example.com'}),'RETURNING_SUBJECT'));
test('duplicate student ID requires review',()=>assert.equal(classifyEnrollment([{auth_subject:'subject-1',student_id:'00123456'}],{authSubject:'subject-2',studentId:'00123456',email:'other@example.com'}),'STUDENT_ID_REVIEW_REQUIRED'));
test('email verification does not verify roster',()=>assert.deepEqual(INITIAL_REGISTRATION_STATE,{emailVerified:false,rosterVerified:false}));

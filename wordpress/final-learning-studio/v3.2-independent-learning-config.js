/* HED3505 v3.2 — non-production UI contract.
 * No secrets. No client-side authority for completion/certificate issuance.
 */
window.HED3505IndependentLearningV32 = Object.freeze({
  version: '3.2',
  mode: 'asynchronous-independent-learning',
  instructor: 'ผู้ช่วยศาสตราจารย์ ดร.เกษม ชูรัตน์',
  missions: [
    {
      id: 'mission-1',
      title: 'Evidence Detective',
      steps: ['read-full-case','classify-evidence','explain-uncertainty','submit','view-guided-feedback','revise','reflect']
    },
    {
      id: 'mission-2',
      title: 'Build & Challenge the Evaluation',
      steps: ['read','build-evaluation-chain','self-audit','missing-evidence','written-defense','submit','view-guided-feedback','revise']
    },
    {
      id: 'mission-3',
      title: 'Individual Evaluation Decision Challenge',
      roles: ['Evaluator','Evidence Auditor','Stakeholder','Decision Maker'],
      decisions: ['CONTINUE','CONTINUE WITH MODIFICATION','COLLECT MORE EVIDENCE','DISCONTINUE'],
      steps: ['read-full-case','audit-evidence','identify-unknowns','interpret','set-criterion','consider-stakeholder','decide','write-defense','submit','view-defensible-answer','revise']
    }
  ],
  finalReview: {
    required: true,
    sections: ['comprehensive-review','key-terms','misconceptions','reasoning-canvas','practice-exam','answers-after-attempt','essay-practice','final-self-check']
  },
  completionRequirements: [
    'mission-1-completed','mission-2-completed','mission-3-completed',
    'required-feedback-viewed','required-revision-completed','final-review-completed','practice-check-completed'
  ],
  certificate: {
    label: 'HED3505 Independent Learning — Certificate of Completion',
    eligibilitySource: 'server-authoritative',
    verification: 'opaque-certificate-id-only',
    publicFields: ['status','certificate_title','learner_display_name','course','completion_date','instructor','certificate_version'],
    forbiddenPublicFields: ['email','auth_id','learner_id','score','answers','attempt_history','internal_ids']
  }
});

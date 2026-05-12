/**
 * POST /api/schedules
 *
 * Owner: Kieran
 * Status: STUB — replace with real candidate-generation + scoring.
 *
 * Contract
 * --------
 * Request body:
 *   {
 *     "courses":     [ <Course>, ... ],   // shape from /api/courses
 *     "constraints": <Constraints>,       // shape from /api/parse-constraints
 *     "topN":        3                    // optional, default 3
 *   }
 *
 * Response (200):
 *   {
 *     "schedules": [
 *       {
 *         "sections":   [ <Section>, ... ],
 *         "score":      0.87,
 *         "breakdown":  {
 *           "workload_balance":    0.9,
 *           "time_gap_efficiency": 0.8,
 *           "difficulty_curve":    0.85,
 *           "constraint_satisfaction": 1.0
 *         },
 *         "explanation": "Keeps your mornings free and avoids back-to-back lectures on Tuesday."
 *       },
 *       ...
 *     ]
 *   }
 *
 * Implementation notes
 * --------------------
 * 1. services/scheduler.js  — conflict-free candidate generation
 *    (backtracking search over sections; prune on time-overlap and
 *    `excluded_courses`).
 * 2. services/scorer.js     — weighted sum over the 4 dimensions
 *    documented in the proposal §2b. Weights live in a constant for
 *    now; can be user-tunable later.
 * 3. Plain-language explanation: short string generated from which
 *    dimensions scored highest and which constraints were respected.
 *    Can be templated for v1; LLM-generated later.
 * 4. Tests in server/test/scheduler.test.js and scorer.test.js.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(501).json({
    error: 'Not implemented yet',
    endpoint: 'POST /api/schedules',
    owner: 'Kieran',
    contract: {
      request: {
        courses: 'Course[] (shape: see /api/courses)',
        constraints: 'Constraints (shape: see /api/parse-constraints)',
        topN: 'number (default 3)',
      },
      response: {
        schedules: [
          {
            sections: 'Section[]',
            score: 'number 0..1',
            breakdown: {
              workload_balance: 'number',
              time_gap_efficiency: 'number',
              difficulty_curve: 'number',
              constraint_satisfaction: 'number',
            },
            explanation: 'string',
          },
        ],
      },
    },
    receivedKeys: Object.keys(req.body || {}),
  });
});

module.exports = router;

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseConstraints } = require('../services/constraintParser');

const ORIGINAL_FETCH = global.fetch;

test.afterEach(() => {
  global.fetch = ORIGINAL_FETCH;
});

test('parseConstraints returns normalized constraint object from Gemini output', async () => {
  process.env.GEMINI_API_KEY = 'test-key';

  global.fetch = async (url, options) => {
    assert.match(url, /generativelanguage.googleapis.com/);
    assert.equal(options.method, 'POST');
    const body = JSON.parse(options.body);
    // Gemini request body uses `contents[0].parts[0].text` for the prompt
    assert.match(body.contents?.[0]?.parts?.[0]?.text || '', /Extract a JSON constraint object/);

    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    no_before: '10:00',
                    light_days: ['Friday'],
                    preferred_times: ['afternoon'],
                    avoid_consecutive: true,
                    required_courses: ['CSE 142'],
                  }),
                },
              ],
            },
          },
        ],
      }),
    };
  };

  const result = await parseConstraints({
    text: 'no classes before 10am, light Friday, avoid back-to-back lectures',
  });

  assert.deepEqual(result, {
    no_before: '10:00',
    light_days: ['Friday'],
    preferred_times: ['afternoon'],
    avoid_consecutive: true,
    required_courses: ['CSE 142'],
  });
});

test('parseConstraints throws when Gemini output is not valid JSON', async () => {
  process.env.GEMINI_API_KEY = 'test-key';

  global.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      candidates: [
        {
          content: { parts: [{ text: 'I could not parse that' }] },
        },
      ],
    }),
  });

  await assert.rejects(
    parseConstraints({ text: 'please parse this' }),
    /Unable to locate JSON object in model response|Failed to parse Gemini JSON response/
  );
});

import { analyzeMedia } from '../src/services/ai/mediaForensics';

async function runTests() {
  console.log('====================================================');
  console.log('THREATLENS FORENSICS PIPELINE VALIDATION TEST SUITE');
  console.log('====================================================\n');

  const results: { test: string; status: 'PASS' | 'FAIL'; details: string }[] = [];

  // TEST 1: Google Flow generated test video (SynthID provenance verified)
  try {
    const res = await analyzeMedia({
      fileName: '10s_google_flow_ai_test_video.mp4',
      fileType: 'video/mp4',
      fileSize: 5 * 1024 * 1024,
      mediaType: 'video',
      videoDurationSec: 10.0,
      isSimulated: true,
    });

    const cu = res.videoContentAnalysis;
    const pv = res.provenanceVerification;
    const pass = 
      cu?.personDetected === true && 
      cu?.firstDetected === '00:02' && 
      cu?.lastDetected === '00:08' &&
      cu?.framesContainingPerson === 10 &&
      cu?.faceDetected === true &&
      pv?.status === 'DETECTED' &&
      pv?.provider === 'google_synthid' &&
      pv?.explanation === 'Google AI provenance was detected in this media.' &&
      res.risk_level === 'HIGH';

    results.push({
      test: 'PROVENANCE TEST 1: Google Flow generated 10s video with SynthID',
      status: pass ? 'PASS' : 'FAIL',
      details: `Provenance Status: ${pv?.status}, Provider: ${pv?.providerName}, Explanation: "${pv?.explanation}", Person: ${cu?.personDetected} (${cu?.firstDetected}–${cu?.lastDetected}), Risk: ${res.risk_level}`
    });
  } catch (e: any) {
    results.push({ test: 'PROVENANCE TEST 1: Google Flow generated video', status: 'FAIL', details: e.message });
  }

  // TEST 2: 10-second video with person in middle (00:02-00:08) without SynthID
  try {
    const res = await analyzeMedia({
      fileName: '10s_middle_person_ai_clip.mp4',
      fileType: 'video/mp4',
      fileSize: 5 * 1024 * 1024,
      mediaType: 'video',
      videoDurationSec: 10.0,
      isSimulated: true,
    });

    const cu = res.videoContentAnalysis;
    const pass = 
      cu?.personDetected === true && 
      cu?.firstDetected === '00:02' && 
      cu?.lastDetected === '00:08' &&
      cu?.framesContainingPerson === 10 &&
      cu?.faceDetected === true &&
      (res.syntheticMediaAnalysis?.status === 'inconclusive' || res.syntheticMediaAnalysis?.status === 'unavailable') &&
      res.estimatedLikelihood === null &&
      res.modelScore === null;

    results.push({
      test: 'VIDEO TEST 1: 10s video with person in middle (00:02–00:08)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Person Detected: ${cu?.personDetected}, First: ${cu?.firstDetected}, Last: ${cu?.lastDetected}, Frames with person: ${cu?.framesContainingPerson}, Face: ${cu?.faceDetected}, Synthetic: ${res.syntheticMediaAnalysis?.status}, Score: ${res.estimatedLikelihood ?? 'null (omitted)'}`
    });
  } catch (e: any) {
    results.push({ test: 'VIDEO TEST 1: 10s video with person in middle', status: 'FAIL', details: e.message });
  }

  // TEST 2: 8-second video with person in middle (00:03-00:06)
  try {
    const res = await analyzeMedia({
      fileName: '8s_middle_person_ai_clip.mp4',
      fileType: 'video/mp4',
      fileSize: 4 * 1024 * 1024,
      mediaType: 'video',
      videoDurationSec: 8.0,
      isSimulated: true,
    });

    const cu = res.videoContentAnalysis;
    const pass = 
      cu?.personDetected === true && 
      cu?.firstDetected === '00:03' && 
      cu?.lastDetected === '00:06' &&
      cu?.framesContainingPerson === 7 &&
      (res.syntheticMediaAnalysis?.status === 'inconclusive' || res.syntheticMediaAnalysis?.status === 'unavailable') &&
      res.estimatedLikelihood === null &&
      res.modelScore === null;

    results.push({
      test: 'VIDEO TEST 2: 8s video with person in middle (00:03–00:06)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Person Detected: ${cu?.personDetected}, First: ${cu?.firstDetected}, Last: ${cu?.lastDetected}, Frames with person: ${cu?.framesContainingPerson}, Synthetic Status: ${res.syntheticMediaAnalysis?.status}, Score: ${res.estimatedLikelihood ?? 'null (omitted)'}`
    });
  } catch (e: any) {
    results.push({ test: 'VIDEO TEST 2: 8s video with person in middle', status: 'FAIL', details: e.message });
  }

  // TEST 2: 8-second video with NO humans (00:00-00:08)
  try {
    const res = await analyzeMedia({
      fileName: '8s_landscape_ai_nohuman.mp4',
      fileType: 'video/mp4',
      fileSize: 3 * 1024 * 1024,
      mediaType: 'video',
      videoDurationSec: 8.0,
      isSimulated: true,
    });

    const cu = res.videoContentAnalysis;
    const pass = 
      cu?.personDetected === false && 
      cu?.firstDetected === null && 
      cu?.lastDetected === null &&
      cu?.framesContainingPerson === 0 &&
      (res.syntheticMediaAnalysis?.status === 'inconclusive' || res.syntheticMediaAnalysis?.status === 'unavailable') &&
      res.estimatedLikelihood === null;

    results.push({
      test: 'VIDEO TEST 3: 8s video without humans (00:00–00:08)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Person Detected: ${cu?.personDetected}, Frames analyzed: ${cu?.framesAnalyzed}, Faces: ${cu?.faceCount}, Synthetic Status: ${res.syntheticMediaAnalysis?.status}`
    });
  } catch (e: any) {
    results.push({ test: 'VIDEO TEST 3: 8s video without humans', status: 'FAIL', details: e.message });
  }

  // TEST 3: Unsupported media format
  try {
    const res = await analyzeMedia({
      fileName: 'document.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 50,
      mediaType: 'image',
    });

    const pass = res.status === 'analysis_failed' && res.detectionStatus === 'analysis_failed';
    results.push({
      test: 'TEST: Unsupported file format rejection',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status: ${res.status}, Message: ${res.summary}`
    });
  } catch (e: any) {
    results.push({ test: 'TEST: Unsupported file format', status: 'FAIL', details: e.message });
  }

  // TEST 4: Isolation test - Image A does not leak into Image B
  try {
    const resA = await analyzeMedia({
      fileName: 'person_portrait.jpg',
      fileType: 'image/jpeg',
      fileSize: 500 * 1024,
      mediaType: 'image',
      isSimulated: true,
    });

    const resB = await analyzeMedia({
      fileName: 'invoice_document.png',
      fileType: 'image/png',
      fileSize: 120 * 1024,
      mediaType: 'image',
      isSimulated: true,
    });

    const pass = resA.id !== resB.id && resA.sha256Hash !== resB.sha256Hash;
    results.push({
      test: 'TEST: Session & upload isolation (Image A vs Image B)',
      status: pass ? 'PASS' : 'FAIL',
      details: `ID A: ${resA.id}, ID B: ${resB.id}, Hashes are distinct: ${resA.sha256Hash !== resB.sha256Hash}`
    });
  } catch (e: any) {
    results.push({ test: 'TEST: Session isolation', status: 'FAIL', details: e.message });
  }

  // TEST 5: Honest synthetic detector omission (no fake 0% or 100%)
  try {
    const res = await analyzeMedia({
      fileName: 'test_video.mp4',
      fileType: 'video/mp4',
      fileSize: 2 * 1024 * 1024,
      mediaType: 'video',
      videoDurationSec: 8.0,
      isSimulated: true,
    });

    const pass = res.estimatedLikelihood === null && res.modelScore === null;
    results.push({
      test: 'TEST: No fake 0% AI or 100% Real score (Strictly null when uncalibrated)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Score is null: ${res.estimatedLikelihood === null}, Model score is null: ${res.modelScore === null}`
    });
  } catch (e: any) {
    results.push({ test: 'TEST: No fake scores', status: 'FAIL', details: e.message });
  }

  console.log('RESULTS:');
  for (const r of results) {
    console.log(`[${r.status}] ${r.test}`);
    console.log(`       ${r.details}\n`);
  }

  const allPassed = results.every(r => r.status === 'PASS');
  console.log(`Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
}

runTests();

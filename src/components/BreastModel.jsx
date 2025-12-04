import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Symptom data per region
const REGION_SYMPTOMS = {
  'Upper Left': [
    {
      key: 'lump',
      label: 'Lump/Thickening',
      info: 'A lump in this area is a common site for breast cancer. It may feel hard, irregular, and fixed, but can also be tender or painless. Many lumps are benign. Please consult a doctor for evaluation.'
    },
    {
      key: 'redness',
      label: 'Redness/Rash',
      info: 'Red or purple patches, sometimes looking like a rash or infection, can appear in this area. More difficult to see on darker skin tones. Persistent redness should be checked by a doctor.'
    },
    {
      key: 'dimpling',
      label: 'Dimpling/Puckering',
      info: 'Dimpling or puckering (skin looks like orange peel) may indicate lymphatic blockage. This is a sign to consult a healthcare professional.'
    },
    {
      key: 'swelling',
      label: 'Swelling',
      info: 'Swelling of all or part of the breast, even if no lump is felt, can occur. Persistent swelling should be evaluated.'
    }
  ],
  'Lower Left': [
    {
      key: 'lump',
      label: 'Lump/Thickening',
      info: 'A lump or thickening in this area should be evaluated. It may feel hard, irregular, or fixed.'
    },
    {
      key: 'swelling',
      label: 'Swelling',
      info: 'Swelling in this area can be due to benign or malignant causes. Persistent swelling should be checked.'
    },
    {
      key: 'dimpling',
      label: 'Dimpling/Puckering',
      info: 'Dimpling or puckering (skin looks like orange peel) may indicate lymphatic blockage. This is a sign to consult a healthcare professional.'
    }
  ],
  'Upper Right': [
    {
      key: 'lump',
      label: 'Lump/Thickening',
      info: 'A lump in this area may be benign or malignant. Watch for changes in skin, pain, or nipple discharge. Consult a doctor for assessment.'
    },
    {
      key: 'redness',
      label: 'Redness/Rash',
      info: 'Red or purple patches, sometimes looking like a rash or infection, can appear in this area. Persistent redness should be checked by a doctor.'
    }
  ],
  'Lower Right': [
    {
      key: 'lump',
      label: 'Lump/Thickening',
      info: 'A lump in this area is often benign but can be associated with cysts or fibroadenomas. Any persistent lump should be checked by a healthcare provider.'
    },
    {
      key: 'swelling',
      label: 'Swelling',
      info: 'Swelling in this area can be due to benign or malignant causes. Persistent swelling should be checked.'
    }
  ],
  'Armpit': [
    {
      key: 'lump',
      label: 'Lump/Swollen Lymph Node',
      info: 'A lump or swelling in the armpit may indicate lymph node involvement. This can be due to infection or, less commonly, cancer spread.'
    }
  ],
  'Breast Area': [
    {
      key: 'lump',
      label: 'Lump/Thickening',
      info: 'Any new lump, thickening, or change in the breast should be evaluated by a healthcare professional. Early detection saves lives!'
    },
    {
      key: 'size',
      label: 'Change in Size/Shape',
      info: 'One breast may look different from the other in size or contour. Any new differences should be checked.'
    },
    {
      key: 'pain',
      label: 'Breast or Underarm Pain',
      info: 'Pain that does not go away with periods, or is sharp/dull, localized or spread out, should be evaluated.'
    },
    {
      key: 'sore',
      label: 'Non-healing Sore',
      info: 'An open wound or sore on the breast that doesn’t heal should be checked by a doctor.'
    }
  ]
};

const DISCHARGE_TYPES = {
  'Bloody/Red/Rust': {
    title: 'Bloody, Red, or Rust-Colored Discharge - ⚠️ ALERT SIGN',
    risk: 'HIGH - Ductal Carcinoma Risk',
    info: (
      <div className="space-y-3 text-gray-700 text-base">
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <b className="text-red-700">🚨 Cancer-Suspect Pattern</b>
          <p className="text-sm">Ye discharge ke color doctors ke liye "alert" sign hote hain, especially agar aap pregnant ya breastfeeding nahi ho.</p>
        </div>
        <div>
          <b>Possible Serious Conditions:</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>Ductal Carcinoma In Situ (DCIS)</b> - Pre-cancer stage, high risk of progression</li>
            <li><b>Invasive Ductal Cancer</b> - Most common type of breast cancer</li>
            <li><b>Papillary Carcinomas</b> - Rare cancer type within milk ducts</li>
            <li><b>Intraductal Papilloma</b> - Usually benign but can be pre-cancerous</li>
          </ul>
        </div>
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <b className="text-yellow-800">⚡ Action Required:</b>
          <p className="text-sm">Turant breast specialist/surgeon ko dikhaye! Blood ya rust-colored discharge kabhi apne aap chala nahi jata.</p>
        </div>
        <div>
          <b>Pattern Indicators (Higher Risk):</b>
          <ul className="list-disc ml-6 text-sm">
            <li>Ek hi breast se discharge ho raha ho</li>
            <li>Ek hi duct/opening se nikl raha ho</li>
            <li>Spontaneous (khud se nikl raha, dabane se nahi)</li>
            <li>Saath mein lump, skin changes, nipple retraction ya underarm nodes ho</li>
          </ul>
        </div>
      </div>
    )
  },
  'Brown/Coffee-Ground': {
    title: 'Brown or Coffee-Ground Discharge - ⚠️ ALERT SIGN',
    risk: 'MEDIUM-HIGH - Cancer Possible',
    info: (
      <div className="space-y-3 text-gray-700 text-base">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
          <b className="text-orange-700">🚨 Cancer-Suspect Pattern</b>
          <p className="text-sm">Bahut dark, coffee-ground type discharge ek serious indicator hai, especially persistent cases mein.</p>
        </div>
        <div>
          <b>Possible Serious Conditions:</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>Ductal Carcinoma In Situ (DCIS)</b> - High risk indicator</li>
            <li><b>Invasive Ductal Cancer</b> - Old blood breakdown product ho sakta hai</li>
            <li><b>Duct Ectasia</b> - Usually benign but can be associated with changes</li>
            <li><b>Fibrocystic Changes</b> - Benign but may have some risk</li>
          </ul>
        </div>
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <b className="text-yellow-800">⚡ Action Required:</b>
          <p className="text-sm">Doctor ko promptly dikhaye, especially agar persistent ho ya saath mein other symptoms hon.</p>
        </div>
        <div>
          <b>Warning Signs (Higher Risk):</b>
          <ul className="list-disc ml-6 text-sm">
            <li>Persistent discharge for weeks/months</li>
            <li>Ek hi breast se</li>
            <li>Saath mein lump ya skin changes</li>
            <li>Nipple retraction ya pulling</li>
            <li>Underarm lymph node swelling</li>
          </ul>
        </div>
      </div>
    )
  },
  'Clear/Watery': {
    title: 'Clear, Watery Discharge - ⚠️ ALERT SIGN',
    risk: 'MEDIUM - Cancer Possible',
    info: (
      <div className="space-y-3 text-gray-700 text-base">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
          <b className="text-blue-700">🚨 Cancer-Suspect Pattern</b>
          <p className="text-sm">Clear, watery discharge jo khud-se aa raha ho (sirf dabane par nahi), sirf ek breast/duct se - ye concerning hai.</p>
        </div>
        <div>
          <b>Possible Serious Conditions:</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>Breast Cancer</b> - Especially if from single duct</li>
            <li><b>Papillary Carcinoma</b> - Rare cancer type</li>
            <li><b>Ductal Carcinoma In Situ (DCIS)</b> - Pre-cancerous condition</li>
            <li><b>Blocked Duct (Benign)</b> - But needs evaluation</li>
          </ul>
        </div>
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <b className="text-yellow-800">⚡ Action Required:</b>
          <p className="text-sm">Doctor se urgently miliye! Single duct se clear discharge cancer ka sign ho sakta hai.</p>
        </div>
        <div>
          <b>Risk Assessment (Higher Risk):</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>SINGLE DUCT, SPONTANEOUS</b> - Highest concern, cancer risk significant</li>
            <li>Age >40 years - Risk increases with age</li>
            <li>Saath mein breast lump</li>
            <li>Saath mein skin changes/dimpling</li>
            <li>Family history of breast cancer</li>
          </ul>
        </div>
      </div>
    )
  },
  'White/Thick/Serous': {
    title: 'Thick White or Serous Discharge (One Side)',
    risk: 'MEDIUM - Requires Investigation',
    info: (
      <div className="space-y-3 text-gray-700 text-base">
        <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
          <b className="text-purple-700">⚠️ Concerning Pattern</b>
          <p className="text-sm">Thick white ya serous discharge jo persistent ho, sirf ek side se, especially with lumps/skin changes.</p>
        </div>
        <div>
          <b>Possible Serious Conditions:</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>Invasive Ductal Carcinoma</b> - If with lump/skin changes</li>
            <li><b>Duct Ectasia</b> - Usually benign</li>
            <li><b>Fibrocystic Changes</b> - Benign</li>
            <li><b>Hormonal Imbalance</b> - Benign</li>
          </ul>
        </div>
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <b className="text-yellow-800">⚡ Action Required:</b>
          <p className="text-sm">Doctor ko dikhaye, especially agar saath mein lump, skin changes, nipple pulling, ya underarm nodes hon.</p>
        </div>
        <div>
          <b>Cancer Risk Increases When Combined With:</b>
          <ul className="list-disc ml-6 text-sm">
            <li>Breast lump or thickening</li>
            <li>Skin dimpling or puckering</li>
            <li>Nipple retraction/pulling inward</li>
            <li>Swollen underarm lymph nodes</li>
            <li>Age >40 years</li>
          </ul>
        </div>
      </div>
    )
  },
  'Milky/White': {
    title: 'Milky or White Discharge (Usually Benign)',
    risk: 'LOW - Usually Benign',
    info: (
      <div className="space-y-3 text-gray-700 text-base">
        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
          <b className="text-green-700">✓ Generally Benign</b>
          <p className="text-sm">Doodh jaisa white discharge zyadatar hormonal changes, breastfeeding, ya medicines ki wajah se hota hai.</p>
        </div>
        <div>
          <b>Common Causes (Non-Cancerous):</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>Pregnancy/Breastfeeding</b> - Normal lactation</li>
            <li><b>Hormone Imbalance</b> - High prolactin levels</li>
            <li><b>Thyroid Issues</b> - Hormonal disruption</li>
            <li><b>Pituitary Problems</b> - Hormonal regulation</li>
            <li><b>Medications</b> - Antipsychotics, antidepressants, etc.</li>
          </ul>
        </div>
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <b className="text-green-800">✓ Generally Safe:</b>
          <p className="text-sm">Ye discharge cancer se zyadatar hormonal issues se relate karta hai. Lekin consultation se nahi darna chahiye.</p>
        </div>
        <div>
          <b>Doctor Ko Dikhaye Agar:</b>
          <ul className="list-disc ml-6 text-sm">
            <li>Discharge sirf ek side se ho raha ho</li>
            <li>Discharge mein blood mixed ho</li>
            <li>Saath mein breast lump or pain ho</li>
            <li>Pregnancy ya breastfeeding nahi kar rahe par discharge continuing ho</li>
          </ul>
        </div>
      </div>
    )
  },
  'Yellow/Green/Grey': {
    title: 'Yellow, Green, Grey, or Thick Sticky Discharge',
    risk: 'LOW-MEDIUM - Usually Benign',
    info: (
      <div className="space-y-3 text-gray-700 text-base">
        <div className="bg-lime-50 border-l-4 border-lime-500 p-3 rounded">
          <b className="text-lime-700">ℹ️ Usually Benign</b>
          <p className="text-sm">Ye discharge colors zyadatar benign conditions se hote hain, jaise duct ectasia, inflammation, ya fibrocystic changes.</p>
        </div>
        <div>
          <b>Common Benign Causes:</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>Duct Ectasia</b> - Ducts mein sticky thick fluid buildup</li>
            <li><b>Chronic Inflammation</b> - Non-cancerous inflammation</li>
            <li><b>Fibrocystic Changes</b> - Common benign condition</li>
            <li><b>Benign Cyst</b> - Fluid-filled sac</li>
          </ul>
        </div>
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <b className="text-green-800">✓ Reassuring:</b>
          <p className="text-sm">Ye colors cancer se rarely associated hote hain, especially agar dono breasts se multiple openings se discharge ho.</p>
        </div>
        <div>
          <b>Monitor For These Warnings:</b>
          <ul className="list-disc ml-6 text-sm">
            <li>Bloody tint develop hona</li>
            <li>Single duct se continuous discharge</li>
            <li>Saath mein breast lump</li>
            <li>Skin changes ya dimpling</li>
            <li>Persistent pain</li>
          </ul>
        </div>
      </div>
    )
  },
  'Pus-Like/Bad-Smelling': {
    title: 'Pus-Like or Bad-Smelling Discharge',
    risk: 'LOW (Cancer-wise) - HIGH (Infection)',
    info: (
      <div className="space-y-3 text-gray-700 text-base">
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <b className="text-red-700">⚠️ Infection Alert (Not Cancer)</b>
          <p className="text-sm">Pus jaisa ya baddad aane wala discharge cancer ka sign nahi hai, lekin iska matlab infection/abscess hai.</p>
        </div>
        <div>
          <b>Likely Causes:</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>Breast Abscess</b> - Pus collection, painful, urgent treatment needed</li>
            <li><b>Bacterial Infection</b> - Mastitis, requires antibiotics</li>
            <li><b>Infected Cyst</b> - Cyst mein infection, drainage needed</li>
            <li><b>Poor Hygiene</b> - Local infection</li>
          </ul>
        </div>
        <div className="bg-red-100 p-3 rounded border border-red-300">
          <b className="text-red-800">🚨 Urgent Action Required:</b>
          <p className="text-sm">JALDI doctor ko dikhaye! Infection antibiotics se theek ho sakta hai, lekin untreated rehne se complications ho sakti hain.</p>
        </div>
        <div>
          <b>Associated Symptoms (Infection Signs):</b>
          <ul className="list-disc ml-6 text-sm">
            <li>Breast mein pain/tenderness</li>
            <li>Swelling, redness, warmth</li>
            <li>Fever ya body ache</li>
            <li>Armpit lymph nodes swollen</li>
          </ul>
        </div>
      </div>
    )
  },
  'Multiple Colors': {
    title: 'Multiple Colors from Multiple Openings (Both Breasts)',
    risk: 'LOW - Usually Benign',
    info: (
      <div className="space-y-3 text-gray-700 text-base">
        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
          <b className="text-green-700">✓ Reassuring Pattern</b>
          <p className="text-sm">Multiple colors, dono breasts se, multiple openings se, sirf dabane par nikalna - ye pattern zyadatar benign hai.</p>
        </div>
        <div>
          <b>Likely Causes (Benign):</b>
          <ul className="list-disc ml-6 text-sm">
            <li><b>Hormonal/Duct Changes</b> - Normal variation</li>
            <li><b>Fibrocystic Breast Disease</b> - Very common, benign</li>
            <li><b>Physiological Discharge</b> - Body's normal response</li>
            <li><b>Multiple Benign Cysts</b> - Various fluid colors</li>
          </ul>
        </div>
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <b className="text-green-800">✓ Lower Cancer Risk:</b>
          <p className="text-sm">Ye multi-opening, multi-color pattern cancer se zyadatar hormonal ya duct changes se relate karta hai.</p>
        </div>
        <div>
          <b>Still Monitor For (Change in Pattern):</b>
          <ul className="list-disc ml-6 text-sm">
            <li>Pattern changing to single duct/single color</li>
            <li>Discharge becoming bloody or clear only</li>
            <li>New breast lump development</li>
            <li>Skin changes appearing</li>
            <li>Significant pain developing</li>
          </ul>
        </div>
      </div>
    )
  }
};

const NIPPLE_INFO = {
  title: 'Nipple Bleeding and Discharge: Breast Cancer se Jude Facts',
  content: (
    <div className="space-y-3 text-gray-700 text-base">
      <b>1. Kya Hoti Hai Nipple Discharge?</b>
      <ul className="list-disc ml-6">
        <li>Nipple se koi bhi liquid ya fluid nikalna, jaise blood, pani jaisa, safed, peela, hara ya bhura, ise nipple discharge bolte hain.</li>
        <li>Ye discharge ek ya dono nipples se aa sakti hai, kabhi apne aap ya dabane par bhi nikal sakti hai.</li>
      </ul>
      <b>2. Bleeding from Nipple (Khoon Ana)</b>
      <ul className="list-disc ml-6">
        <li>Agar nipple se khoon (bloody discharge) niklta hai, to yeh ek important symptom hai jo benign (non-cancerous) aur kabhi kabhi breast cancer dono ki taraf ishara kar sakta hai.</li>
        <li><b>Common benign causes:</b> intraductal papilloma (milk duct mein chota safed mass), duct ectasia (duct ka fail jana).</li>
        <li><b>Cancer risk:</b> Bloody discharge se breast cancer hone ka risk dusre colors ki discharge ki tulna mein zyada hai.</li>
        <li>Usually, agar discharge ek breast se, bina dabaye nikal raha ho, to doctor ko turant dikhaye.</li>
      </ul>
      <b>3. Types of Nipple Discharge aur Matalab</b>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-pink-200 mb-2">
          <thead>
            <tr className="bg-pink-50">
              <th className="border px-2 py-1">Discharge Ka Rang</th>
              <th className="border px-2 py-1">Common Wajah</th>
              <th className="border px-2 py-1">Cancer Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">Bloody (laal/pink)</td>
              <td className="border px-2 py-1">Intraductal papilloma, cancer</td>
              <td className="border px-2 py-1">Kabhi-kabhi cancer</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">Clear (saaf/pani jaisa)</td>
              <td className="border px-2 py-1">Blocked duct, kabhi cancer</td>
              <td className="border px-2 py-1">Cancer ho sakta hai</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">Yellow/green</td>
              <td className="border px-2 py-1">Infection, duct ectasia</td>
              <td className="border px-2 py-1">Zyada tar benign</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">Brown/bhura</td>
              <td className="border px-2 py-1">Fibrocystic changes</td>
              <td className="border px-2 py-1">Rarely cancer</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">Milky</td>
              <td className="border px-2 py-1">Hormonal, breastfeeding</td>
              <td className="border px-2 py-1">Na ke barabar cancer risk</td>
            </tr>
          </tbody>
        </table>
      </div>
      <span className="text-xs text-gray-500">*Note: Sirf bleeding ya discharge nahi, saath mein lump, dard, ya skin changes ho to risk aur badh jata hai.*</span>
      <b>4. Related Symptoms</b>
      <ul className="list-disc ml-6">
        <li>Breast pain/swelling</li>
        <li>Lump ya mass feel hona</li>
        <li>Nipple mein kuch shape ka badlav (andar jana, hard hona)</li>
        <li>Skin pe rash, redness ya ulcer</li>
      </ul>
      <b>5. Kab Doctor ko Dikhana Chahiye?</b>
      <ul className="list-disc ml-6">
        <li>Agar nipple se repeatedly ya bina dabaye khoon nikal raha ho</li>
        <li>Discharge sirf ek breast se ho</li>
        <li>Saath mein breast mein lump, dard ya skin changes ho</li>
        <li>Post-menopausal ya >40 saal ki umar mein koi bhi aisa symptom dikhe</li>
      </ul>
      <b>6. Breast Cancer se Kaise Link Hota Hai?</b>
      <ul className="list-disc ml-6">
        <li>Nipple bleeding/discharge kabhi breast cancer ka pehla lakshan bhi ho sakta hai, khas kar agar koi lump nahi mil raha.</li>
        <li>Paget’s disease of the breast naam ka cancer nipple aur areola mein changes kaaran hota hai, ismein discharge, bleeding, dryness ya itching ho sakti hai.</li>
      </ul>
      <b>7. Important Points</b>
      <ul className="list-disc ml-6">
        <li>Har nipple discharge cancer nahi hota, lekin kuch rang (bloody ya clear) zyada risky hain.</li>
        <li>Early check-up se sahi diagnosis aur treatment ho sakta hai.</li>
        <li>Agar koi doubt ho, breast specialist ya surgeon ko consult karein.</li>
      </ul>
      <div className="mt-2 text-pink-600 font-semibold italic">Aapki safety ke liye, breast changes ko ignore na karein. Jaldi pehchaan se treatment asaan rehta hai!</div>
    </div>
  )
};

function InfoModal({ open, onClose, title, message, symptomOptions, onSymptomSelect, nippleStep = 0, setModal, nippleData = {} }) {
  if (!open) return null;
  // Step 1: Ask about discharge type
  if (title === 'Nipple/Areola' && nippleStep === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-xl font-bold">&times;</button>
          <h3 className="text-2xl font-bold text-pink-600 mb-4">Nipple Discharge - Which Type?</h3>
          <p className="mb-6 text-gray-700 text-sm">Carefully observe the color/type of discharge and select below:</p>
          <div className="grid grid-cols-1 gap-3 mb-6">
            {Object.entries(DISCHARGE_TYPES).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setModal(m => ({ ...m, nippleStep: 2, nippleData: { ...m.nippleData, dischargeType: key } }))}
                className="p-3 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition text-left"
              >
                <div className="font-semibold text-pink-600">{data.title}</div>
                <div className="text-xs text-gray-600 mt-1">Risk: {data.risk}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // Step 2: Show detailed info for selected discharge type
  if (title === 'Nipple/Areola' && nippleStep === 2) {
    const dischargeData = DISCHARGE_TYPES[nippleData.dischargeType];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-xl font-bold">&times;</button>
          <div className="mb-2">
            <span className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">{dischargeData.risk}</span>
          </div>
          <h3 className="text-2xl font-bold text-pink-600 mb-6">{dischargeData.title}</h3>
          {dischargeData.info}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setModal(m => ({ ...m, nippleStep: 1 }))}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
            >
              ← Back to Types
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-xl font-bold">&times;</button>
        <h3 className="text-2xl font-bold text-pink-600 mb-4">{title}</h3>
        {symptomOptions && symptomOptions.length > 0 ? (
          <>
            <div className="mb-4 text-gray-700">Which symptom do you notice here?</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {symptomOptions.map(opt => (
                <button
                  key={opt.key}
                  className="px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200 transition"
                  onClick={() => onSymptomSelect(opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500">If you have more than one symptom, select the most prominent one.</div>
          </>
        ) : (
          <>
            <div className="text-gray-700 text-base mb-4">{message}</div>
            <div className="text-xs text-gray-500">Many of these symptoms can occur in non-cancerous conditions (infections, cysts, hormonal changes). If you notice any persistent or unusual changes, consult a doctor—early detection is key to effective treatment.</div>
          </>
        )}
      </div>
    </div>
  );
}

function BreastModelInner({ onRegionClick, onHoverRegion }) {
  const { scene } = useGLTF('/models/breast.glb');
  const meshRef = useRef();
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Helper to detect region from point
  const detectRegion = (point) => {
    // Region mapping (x: left/right, y: up/down, z: depth)
    // Check for Nipple/Areola FIRST with larger detection area - most important!
    let detected = null;
    // Detect both nipples: right and left
    // Right nipple (x ~1.2, y ~-0.13), Left nipple (x ~-1.2, y ~-0.13)
    if (
      (Math.pow(point.x - 1.2, 2) + Math.pow(point.y + 0.13, 2) < 0.065) ||
      (Math.pow(point.x + 1.2, 2) + Math.pow(point.y + 0.13, 2) < 0.065)
    ) {
      detected = 'Nipple/Areola';
    } else if (point.x < -0.5 && point.y > 0.5) {
      detected = 'Armpit';
    } else if (point.y > 0.3 && point.x < 0) {
      detected = 'Upper Left';
    } else if (point.y > 0.3 && point.x >= 0) {
      detected = 'Upper Right';
    } else if (point.y <= 0.3 && point.x < 0) {
      detected = 'Lower Left';
    } else if (point.y <= 0.3 && point.x >= 0) {
      detected = 'Lower Right';
    } else {
      detected = 'Breast Area';
    }
    return detected;
  };

  // Hover handler to show region label
  const handlePointerMove = (e) => {
    const point = e.point;
    const region = detectRegion(point);
    setHoveredRegion(region);
    onHoverRegion(region);
  };

  // Click handler to detect region
  const handlePointerDown = (e) => {
    const point = e.point;
    const region = detectRegion(point);
    onRegionClick(region);
  };

  // Leave handler to hide region label
  const handlePointerLeave = () => {
    setHoveredRegion(null);
    onHoverRegion(null);
  };

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={2.5}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ cursor: 'pointer' }}
    />
  );
}

// Region Labels Component
function RegionLabel({ region }) {
  if (!region) return null;
  
  const regionInfo = {
    'Upper Left': { color: 'bg-pink-500', icon: '↗️' },
    'Upper Right': { color: 'bg-purple-500', icon: '↖️' },
    'Lower Left': { color: 'bg-blue-500', icon: '↘️' },
    'Lower Right': { color: 'bg-yellow-500', icon: '↙️' },
    'Nipple/Areola': { color: 'bg-red-600', icon: '❤️' },
    'Armpit': { color: 'bg-green-500', icon: '🔄' },
    'Breast Area': { color: 'bg-indigo-500', icon: '⭐' },
  };

  const info = regionInfo[region] || { color: 'bg-gray-500', icon: '◯' };

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
      <div className={`${info.color} text-white px-6 py-3 rounded-full shadow-xl font-semibold text-lg flex items-center gap-2 backdrop-blur-sm`}>
        <span>{info.icon}</span>
        {region}
      </div>
    </div>
  );
}

export function BreastModel() {
  const [modal, setModal] = useState({ open: false, title: '', message: '', symptomOptions: null, nippleStep: 0, nippleData: {} });
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Step 1: User clicks a region
  const handleRegionClick = (region) => {
    // Nipple/Areola: show symptom buttons (Discharge, Retraction, Texture, Pain)
    if (region === 'Nipple/Areola') {
      setModal({
        open: true,
        title: region,
        message: '',
        symptomOptions: [
          { key: 'discharge', label: 'Discharge', info: '' },
          { key: 'retraction', label: 'Retraction', info: 'Nipple retraction means the nipple is pulled inward. This can be a sign of underlying disease and should be evaluated by a doctor.' },
          { key: 'texture', label: 'Texture Change', info: 'Changes in the skin texture of the nipple/areola, such as scaling, thickening, or ulceration, can be signs of Paget’s disease or other conditions.' },
          { key: 'pain', label: 'Pain', info: 'Pain in the nipple/areola can have many causes, including infection, trauma, or rarely, cancer. Persistent pain should be evaluated.' }
        ],
        nippleStep: 0,
        nippleData: {}
      });
      return;
    }

    const symptoms = REGION_SYMPTOMS[region] || [];
    if (symptoms.length === 1) {
      // Only one symptom possible, show info directly
      setModal({
        open: true,
        title: region,
        message: symptoms[0].info,
        symptomOptions: null
      });
    } else if (symptoms.length > 1) {
      // Multiple symptoms possible, ask user
      setModal({
        open: true,
        title: region,
        message: '',
        symptomOptions: symptoms
      });
    } else {
      // Fallback
      setModal({
        open: true,
        title: region,
        message: 'Any new lump, thickening, or change in the breast should be evaluated by a healthcare professional. Early detection saves lives!',
        symptomOptions: null
      });
    }
  };

  // Step 2: User selects a symptom
  const handleSymptomSelect = (opt) => {
    // Nipple/Areola special logic
    if (modal.title === 'Nipple/Areola' && opt.key === 'discharge') {
      setModal(m => ({
        ...m,
        nippleStep: 1,
        symptomOptions: null,
        message: '',
        open: true
      }));
      return;
    }
    // For other nipple symptoms, show info directly
    if (modal.title === 'Nipple/Areola') {
      setModal(m => ({
        ...m,
        message: opt.info,
        symptomOptions: null,
        open: true
      }));
      return;
    }
    setModal(m => ({
      ...m,
      message: opt.info,
      symptomOptions: null,
      open: true
    }));
  };

  return (
    <>
    <RegionLabel region={hoveredRegion} />
    <Canvas style={{ height: '600px' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} />
        <BreastModelInner onRegionClick={handleRegionClick} onHoverRegion={setHoveredRegion} />
        <OrbitControls enableZoom={true} />
      </Canvas>
      <InfoModal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false, nippleStep: 0, nippleData: {} })}
        title={modal.title}
        message={modal.message}
        symptomOptions={modal.symptomOptions}
        onSymptomSelect={handleSymptomSelect}
        nippleStep={modal.nippleStep}
        setModal={setModal}
        nippleData={modal.nippleData}
      />
    </>
  );
}


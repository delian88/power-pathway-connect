<?php
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

function saveImg($base64, $filename) {
    if (!$base64 || !$filename) return null;
    $publicDir = __DIR__ . '/../public';
    if (!is_dir($publicDir)) {
        mkdir($publicDir, 0777, true);
    }
    
    $parts = explode(',', $base64);
    $data = isset($parts[1]) ? $parts[1] : $parts[0];
    
    $decoded = base64_decode($data);
    $filePath = $publicDir . '/' . basename($filename);
    
    if (file_put_contents($filePath, $decoded)) {
        return '/' . basename($filename);
    }
    return null;
}

$updateFields = [];
$updateValues = [];

// Handle simple image fields
$imgFields = [
    'whyAttendCard1Img', 'whyAttendCard2Img', 'whyAttendCard3Img',
    'ourApproachCard1Img', 'ourApproachCard2Img', 'ourApproachCard3Img',
    'aboutHeroImg', 'agendaHeroImg', 'logo', 'partnerLogo1', 'partnerLogo2', 'partnerLogo3', 'partnerLogo4'
];

foreach ($imgFields as $prefix) {
    if (!empty($input[$prefix . 'Base64']) && !empty($input[$prefix . 'FileName'])) {
        $url = saveImg($input[$prefix . 'Base64'], $input[$prefix . 'FileName']);
        if ($url) {
            $input[$prefix . 'Url'] = $url;
        }
    }
}

// Handle agenda brochure (pdf)
if (!empty($input['agendaBrochureBase64']) && !empty($input['agendaBrochureFileName'])) {
    $url = saveImg($input['agendaBrochureBase64'], $input['agendaBrochureFileName']);
    if ($url) {
        $input['agendaBrochureUrl'] = $url;
    }
}

// Handle Slider Images
if (!empty($input['sliderImagesBase64']) && is_array($input['sliderImagesBase64'])) {
    $uploadedUrls = [];
    foreach ($input['sliderImagesBase64'] as $i => $b64) {
        $fname = $input['sliderImagesFileNames'][$i] ?? 'slider_'.time().'_'.$i.'.jpg';
        $url = saveImg($b64, $fname);
        if ($url) $uploadedUrls[] = $url;
    }
    
    $existing = [];
    if (!empty($input['heroSliderImages'])) {
        $parsed = json_decode($input['heroSliderImages'], true);
        if (is_array($parsed)) $existing = $parsed;
    }
    $input['heroSliderImages'] = json_encode(array_merge($existing, $uploadedUrls));
}

// Handle Featured Speakers array (JSON)
if (!empty($input['featuredSpeakers']) && is_array($input['featuredSpeakers'])) {
    foreach ($input['featuredSpeakers'] as &$sp) {
        if (!empty($sp['imgBase64']) && !empty($sp['imgFileName'])) {
            $url = saveImg($sp['imgBase64'], $sp['imgFileName']);
            if ($url) $sp['imgUrl'] = $url;
            unset($sp['imgBase64']);
            unset($sp['imgFileName']);
        }
    }
    $input['featuredSpeakers'] = json_encode($input['featuredSpeakers']);
}

// Handle Sponsorship Packages array (JSON)
if (isset($input['sponsorshipPackages'])) {
    if (is_array($input['sponsorshipPackages'])) {
        $input['sponsorshipPackages'] = json_encode($input['sponsorshipPackages']);
    }
}

// List of allowed fields to update
$allowedFields = [
    'tagline', 'eventName', 'eventDate', 'address', 'heroTitle', 'heroSubtitle',
    'contactEmail', 'contactPhone', 'primaryColor', 'ticketPrice',
    'logoUrl', 'heroSliderImages', 'featuredSpeakers', 'scheduleDaysCount',
    'whyAttendTitle', 'whyAttendSubtitle', 'whyAttendCard1Title', 'whyAttendCard1Desc', 'whyAttendCard1ImgUrl',
    'whyAttendCard2Title', 'whyAttendCard2Desc', 'whyAttendCard2ImgUrl',
    'whyAttendCard3Title', 'whyAttendCard3Desc', 'whyAttendCard3ImgUrl',
    'aboutHeroTitle', 'aboutHeroDesc', 'aboutHeroImgUrl', 'ourApproachTitle', 'ourApproachDesc',
    'ourApproachCard1Title', 'ourApproachCard1Desc', 'ourApproachCard1ImgUrl',
    'ourApproachCard2Title', 'ourApproachCard2Desc', 'ourApproachCard2ImgUrl',
    'ourApproachCard3Title', 'ourApproachCard3Desc', 'ourApproachCard3ImgUrl',
    'agendaHeroTitle', 'agendaHeroSubtitle', 'agendaHeroImgUrl', 'agendaBrochureUrl',
    'confGuideTitle', 'confGuideSubtitle',
    'confGuideTrack1Title', 'confGuideTrack1Subtitle', 'confGuideTrack1Date', 'confGuideTrack1EventTitle', 'confGuideTrack1EventDesc',
    'confGuideTrack2Title', 'confGuideTrack2Subtitle', 'confGuideTrack2Date', 'confGuideTrack2EventTitle', 'confGuideTrack2EventDesc',
    'confGuideTrack3Title', 'confGuideTrack3Subtitle', 'confGuideTrack3Date', 'confGuideTrack3EventTitle', 'confGuideTrack3EventDesc',
    'sponsorshipHeroTitle', 'sponsorshipHeroTagline', 'sponsorshipHeroDesc',
    'partnerLogo1Url', 'partnerLogo2Url', 'partnerLogo3Url', 'partnerLogo4Url',
    'sponsorshipPackages', 'sponsorshipCtaTitle', 'sponsorshipCtaDesc',
    'contactPageTagline', 'contactPageTitle', 'contactPageDesc'
];

foreach ($allowedFields as $field) {
    if (array_key_exists($field, $input)) {
        $updateFields[] = "$field = :$field";
        $updateValues[":$field"] = $input[$field];
    }
}

if (empty($updateFields)) {
    echo json_encode(['success' => true, 'message' => 'No fields to update']);
    exit;
}

try {
    $sql = "UPDATE SiteSettings SET " . implode(', ', $updateFields) . " WHERE id = 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($updateValues);
    
    echo json_encode(['success' => true]);
} catch (\PDOException $e) {
    // http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `heroBadgeText` TEXT NULL,
    `heroText` TEXT NOT NULL,
    `heroSubText` TEXT NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `eventFee` DOUBLE NOT NULL DEFAULT 0,
    `smtpHost` VARCHAR(191) NULL,
    `smtpPort` INTEGER NULL,
    `smtpUser` VARCHAR(191) NULL,
    `smtpPass` VARCHAR(191) NULL,
    `emailEnabled` BOOLEAN NOT NULL DEFAULT false,
    `headerPatronageText` TEXT NULL,
    `headerPresidentText` TEXT NULL,
    `headerLocationText` TEXT NULL,
    `headerLocationSubText` TEXT NULL,
    `headerDateText` VARCHAR(191) NULL,
    `heroSliderImages` TEXT NULL,
    `transformationHubTitle` TEXT NULL,
    `transformationHubDescription` TEXT NULL,
    `partnerNames` TEXT NULL,
    `infoBarDateText` VARCHAR(191) NULL,
    `infoBarLocationText` VARCHAR(191) NULL,
    `infoBarThemeText` VARCHAR(191) NULL,
    `transformationHubFeature1Title` VARCHAR(191) NULL,
    `transformationHubFeature1Desc` TEXT NULL,
    `transformationHubFeature2Title` VARCHAR(191) NULL,
    `transformationHubFeature2Desc` TEXT NULL,
    `transformationHubFeature3Title` VARCHAR(191) NULL,
    `transformationHubFeature3Desc` TEXT NULL,
    `transformationHubFeature4Title` VARCHAR(191) NULL,
    `transformationHubFeature4Desc` TEXT NULL,
    `scheduleTitle` VARCHAR(191) NULL,
    `scheduleDescription` TEXT NULL,
    `whyAttendTitle` VARCHAR(191) NULL,
    `whyAttendSubtitle` TEXT NULL,
    `whyAttendCard1Title` VARCHAR(191) NULL,
    `whyAttendCard1Desc` TEXT NULL,
    `whyAttendCard1ImgUrl` TEXT NULL,
    `whyAttendCard2Title` VARCHAR(191) NULL,
    `whyAttendCard2Desc` TEXT NULL,
    `whyAttendCard2ImgUrl` TEXT NULL,
    `whyAttendCard3Title` VARCHAR(191) NULL,
    `whyAttendCard3Desc` TEXT NULL,
    `whyAttendCard3ImgUrl` TEXT NULL,
    `scheduleDaysCount` INTEGER NULL DEFAULT 4,
    `scheduleDates` JSON NULL,
    `confGuideTitle` VARCHAR(191) NULL,
    `confGuideSubtitle` TEXT NULL,
    `confGuideTrack1Title` VARCHAR(191) NULL,
    `confGuideTrack1Subtitle` TEXT NULL,
    `confGuideTrack1Date` VARCHAR(191) NULL,
    `confGuideTrack1EventTitle` VARCHAR(191) NULL,
    `confGuideTrack1EventDesc` TEXT NULL,
    `confGuideTrack2Title` VARCHAR(191) NULL,
    `confGuideTrack2Subtitle` TEXT NULL,
    `confGuideTrack2Date` VARCHAR(191) NULL,
    `confGuideTrack2EventTitle` VARCHAR(191) NULL,
    `confGuideTrack2EventDesc` TEXT NULL,
    `confGuideTrack3Title` VARCHAR(191) NULL,
    `confGuideTrack3Subtitle` TEXT NULL,
    `confGuideTrack3Date` VARCHAR(191) NULL,
    `confGuideTrack3EventTitle` VARCHAR(191) NULL,
    `confGuideTrack3EventDesc` TEXT NULL,
    `featuredSpeakersTitle` VARCHAR(191) NULL,
    `featuredSpeakersSubtitle` TEXT NULL,
    `featuredSpeakersCount` INTEGER NULL DEFAULT 4,
    `featuredSpeakers` JSON NULL,
    `ourApproachTitle` VARCHAR(191) NULL,
    `ourApproachCard1Title` VARCHAR(191) NULL,
    `ourApproachCard1Desc` TEXT NULL,
    `ourApproachCard1ImgUrl` TEXT NULL,
    `ourApproachCard2Title` VARCHAR(191) NULL,
    `ourApproachCard2Desc` TEXT NULL,
    `ourApproachCard2ImgUrl` TEXT NULL,
    `ourApproachCard3Title` VARCHAR(191) NULL,
    `ourApproachCard3Desc` TEXT NULL,
    `ourApproachCard3ImgUrl` TEXT NULL,
    `aboutHeroBadgeText` VARCHAR(191) NULL,
    `aboutHeroTitle` VARCHAR(191) NULL,
    `aboutHeroSubtitle` TEXT NULL,
    `aboutHeroImgUrl` TEXT NULL,
    `aboutMissionTitle` VARCHAR(191) NULL,
    `aboutMissionSubtitle` TEXT NULL,
    `aboutMissionCardTitle` VARCHAR(191) NULL,
    `aboutMissionCardDesc` TEXT NULL,
    `aboutVisionCardTitle` VARCHAR(191) NULL,
    `aboutVisionCardDesc` TEXT NULL,
    `aboutVenuesTitle` VARCHAR(191) NULL,
    `aboutVenuesSubtitle` TEXT NULL,
    `aboutVenuesCount` INTEGER NULL DEFAULT 2,
    `aboutVenues` JSON NULL,
    `aboutVenuesWarningText` TEXT NULL,
    `aboutCtaTitle` VARCHAR(191) NULL,
    `aboutCtaSubtitle` TEXT NULL,
    `agendaHeroTitle` VARCHAR(191) NULL,
    `agendaHeroSubtitle` TEXT NULL,
    `agendaHeroDesc` TEXT NULL,
    `agendaHeroImgUrl` TEXT NULL,
    `agendaSectionTitle` VARCHAR(191) NULL,
    `agendaSectionSubtitle` TEXT NULL,
    `agendaDaysCount` INTEGER NULL DEFAULT 4,
    `agendaDays` JSON NULL,
    `agendaBrochureUrl` TEXT NULL,
    `sponsorshipHeroTagline` VARCHAR(191) NULL,
    `sponsorshipHeroTitle` VARCHAR(191) NULL,
    `sponsorshipHeroDesc` TEXT NULL,
    `sponsorshipPartnersTitle` VARCHAR(191) NULL,
    `sponsorshipPartnersDesc` TEXT NULL,
    `sponsorshipPartners` JSON NULL,
    `sponsorshipPackagesTitle` VARCHAR(191) NULL,
    `sponsorshipPackagesDesc` TEXT NULL,
    `sponsorshipPackages` JSON NULL,
    `sponsorshipCtaTitle` VARCHAR(191) NULL,
    `sponsorshipCtaDesc` TEXT NULL,
    `contactPageTagline` VARCHAR(191) NULL,
    `contactPageTitle` VARCHAR(191) NULL,
    `contactPageDesc` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduleItem` (
    `id` VARCHAR(191) NOT NULL,
    `day` INTEGER NOT NULL,
    `timeRange` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `speaker` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `caption` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `content` TEXT NULL,
    `date` DATETIME(3) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `sponsorImageUrl` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'workshop',
    `location` VARCHAR(191) NULL,
    `capacity` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Draft',
    `category` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Event_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registration` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NOT NULL,
    `jobTitle` VARCHAR(191) NOT NULL,
    `ticketType` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


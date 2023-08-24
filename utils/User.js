import { Schema, model, models } from "mongoose";

const MediaContentSchema = new Schema({
    mediaType: {
        type: String,
        enum: ["image", "video", "audio"], // example media types
        required: true
    },
    awsLink: {
        type: String,
        required: true
    }
});

const PinterestTextualDataSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    destinationLink: {
        type: String,
        required: true
    },
    board: {
        type: String,
        required: true
    }
});

const TextualDataSchema = new Schema({
    pinterest: PinterestTextualDataSchema,
    // Other platforms' specific schemas can be added here
    // For example:
    // tiktok: TikTokTextualDataSchema,
});

const PostContentSchema = new Schema({
    media: MediaContentSchema,
    textualData: TextualDataSchema
});

const PostSchema = new Schema({
    postStatus: {
        type: String,
        enum: ["in review", "rejected", "published"],
        required: true
    },
    platform: String,
    postLink: String, // for published posts
    postTitle: String, // this is only within SumBroo
    publishingDate: Date,
    // before the review, this represents the date at which 
    // user hit publish after the review this should be 
    // updated to the actual publishing date (in case of accepting the post)
    postId: String, // post ID from the platform API
    content: PostContentSchema, // after publishing remove the content
    comment: String, // for rejected posts
});

const SocialMediaLinkSchema = new Schema({
    platformName: {
        type: String,
        required: true
    },
    profileLink: {
        type: String,
        required: true
    }, 
    profileStatus: {
        type: String,
        enum: ["new", "pendingSubscriptionPayment", "active", "canceledSubscriptionPayment"],
        // "New": profile has just been linked.
        // "Disabled": profile disabled by admin for quality and other issues.(rare case)
        // "Active": profile is fully active. 
        // "Pending": awaiting user upgrading his plan. You'll have to send an email with
        // a link to the Stripe management page in which he has to upgrade the plan. The email
        // will expires after 24H. Otherwise, he can find the link above the platform in 
        // Settings > Linked Accounts, or he/she can click on the manage billing and pay from there. 
        required: true
        // If rejected, we remove the profile and send him a message on why 
        // we rejected him and that when he fulfills the reqs, he can a send a profile linking req
    }, 
    lastPublished: {
        type: Date,
        default: null
        /*
            // This is for checking each Platform's publishing limit time window:
            // You can also have different requirements for each platform
            const now = new Date();
            if (!user.lastPublished || (now - user.lastPublished) > (24 * 60 * 60 * 1000)) {
              // Allow publishing
              user.lastPublished = now;
              await user.save();
            } else {
              // Deny publishing and inform the user
            }
        */
    },
    pricePlans: {
        type: [String]
        // for now you only include the 
        // the monthly and annual plan price 
        // for Pinterest, then you can add more pricePlan 
        // (priceIds) of all the plans where this platform exits
        // this way we will be able to see which plan the user is part 
        // of
    },
    niche: {
        type: String
    },
    audience: {
        type: [String],
        validate: {
            validator: function(array) {
                return array.length <= 8;
            },
            message: 'Audience array size should not exceed 6 tags.'
        }
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    tokenExpirationDate: Number,
});

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    accountStatus: {
        type: String,
        enum: ["new","disabled", "active", "pending"],
        // "New": account has just been created.
        // "Disabled": account has been disabled by admin for quality and other issues.(rare case)
        // "Active": account is fully active.
        // "Pending": awaiting user payment/onboarding before activation. You'll have to send an email
        // in which you direct them to pay first, then start onboarding. The email link expires after
        // 48H after which the user is deleted from the DB.
        required: true
        // If rejected, we remove the user entirely and send him a message on why 
        // we rejected him and that when he fulfills the reqs, he can create an account again
    }, 
    password: {
        type: String
    },
    initialPlanChosen: {
        type: String
    },
    onboardingStep: {
        type: Number,
        default: 0
    },
    applicationDate: {
        type: String, 
        required: true
    },
    stripeId: {
        type: String,
        unique: true
    },
    socialMediaLinks: [SocialMediaLinkSchema],
    posts: [PostSchema]
});

let User;
try {
    User = model('user');
} catch {
    User = model('user', UserSchema);
}

export default User;

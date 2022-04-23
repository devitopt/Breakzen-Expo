import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
} from 'react-native';
import { SupportHeader, styles } from './supportheader';

export default function TermsAndConditions({ navigation }) {
  const bullet = '\u2B24   ';
  return (
    <View style={styles.container}>
      <SupportHeader title="Refund and Terms" navigation={navigation} />
      <ScrollView
        style={styles.scrollViewer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>REFUND POLICY</Text>
        <View style={styles.chapter}>
          <Text style={styles.h1}>Welcome to Breakzen!</Text>
          <Text style={styles.p}>
            Breakzen is owned and operated by Breakzen LLC.
          </Text>
          <Text style={styles.p}>
            This Refund Policy applies to all services purchased through:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Breakzen App (Android and iOS version – Available on
              Google Play and App store)
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              https://breakzen.com
            </Text>
          </View>
          <Text style={styles.p}>
            Our Refund Policy forms part of our Terms and Conditions and Privacy
            Policy and should be read in conjunction with those documents. We
            reserve the right to modify this refund policy at any time without
            notice. Please refer to this refund policy before making any
            purchase of a service or subscription.
          </Text>
          <Text style={styles.p}>
            By purchasing a subscription, you represent and agree to be bound by
            the terms and conditions described below. Our refund policy does not
            affect your statutory rights.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>1. REFUNDS AND CANCELLATIONS</Text>
          <Text style={styles.p}>
            Users may cancel the subscription and request a refund of the first
            payment corresponding to the subscription fee chosen by the user,
            during the first 14 days from the start of the subscription. If the
            user requests a refund after 14 days from the start of the
            subscription, we cannot offer a refund. To request a refund and
            cancellation of the subscription, please send us your refund request
            within 14 days of the start of your subscription through our contact
            information.
          </Text>
          <Text style={styles.p}>
            Subscriptions will automatically renew for an additional period
            unless cancelled before the next billing period. The user may cancel
            the subscription at any time and access to the paid features will
            continue to be available until the next billing date, when it will
            be permanently suspended. Subscriptions can be cancelled through the
            platform or by sending us your cancellation request through our
            contact information.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>2. BACKGROUND CHECK</Text>
          <Text style={styles.p}>
            The fee for the background check process for Professional users is
            non-refundable.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>3. REFUND PROCESSING</Text>
          <Text style={styles.p}>
            Once your refund request has been received, please allow 3 to 5
            business days for your refund request to be processed. If your
            refund request has been accepted, your refund will be issued, and
            you will receive a confirmation email. The refund will be issued via
            the original payment method.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>4. CONTACT US</Text>
          <Text style={styles.p}>
            If you have questions about this Refund Policy, please contact us
            through our contact page or via the contact information below:
          </Text>
          <Text style={styles.p}>Breakzen LLC.</Text>
          <Text style={styles.p}>support@breakzen.com</Text>
        </View>
        <View style={styles.bottomSpace} />

        <Text style={styles.title}>TERMS AND CONDITIONS</Text>
        <View style={styles.chapter}>
          <Text style={styles.h1}>Welcome to Breakzen!</Text>
          <Text style={styles.p}>
            Breakzen is owned and operated by Breakzen LLC.
          </Text>
          <Text style={styles.p}>These are the terms and conditions for:</Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Breakzen App (Android and iOS version - Available on
              Google Play and App store)
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              https://breakzen.com
            </Text>
          </View>
          <Text style={styles.p}>(Hereinafter referred to as “Breakzen”)</Text>
          <Text style={styles.p}>
            By registering and using the platform, you agree to be bound by
            these Terms and Conditions ("Terms") and our Privacy Policy. If you
            do not accept all these Terms, then you may not use our platform and
            services. In these terms, "we", "us", "our" and "Breakzen" refers to
            Breakzen and "you" and “your" refers to you, the user of Breakzen.
          </Text>
          <Text style={styles.p}>
            The following terms and conditions apply to the platform and
            services offered by Breakzen. This includes the mobile and tablet
            versions as well as any other version of Breakzen accessible via
            desktop, mobile, tablet, social media, or other devices.
          </Text>
          <Text style={styles.p}>
            PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE ACCESSING,
            USING OR OBTAINING ANY MATERIALS, INFORMATION OR SERVICES.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>1. ELIGIBLITY</Text>
          <Text style={styles.p}>
            You may use the platform only in compliance with these terms and all
            applicable local, state, national, and international laws, rules,
            and regulations.
          </Text>
          <Text style={styles.p}>
            The use of the platform is available for all ages. In the case of
            minors, it is the responsibility of parents and legal guardians to
            determine whether use of the platform or any of the content and
            functionality available on the platform is appropriate for their
            child or minor ward. Breakzen reserves the right to make the
            necessary checks during the registration process.
          </Text>
          <Text style={styles.p}>
            You represent and warrant that all registration information you
            submit is accurate and truthful; and that your use of the platform
            does not violate any applicable law or regulation. Breakzen may, in
            its sole discretion, refuse to offer the platform and services to
            any user and change its eligibility criteria at any time. This
            provision is void where prohibited by law and the right to access
            the service and the platform is revoked in such jurisdictions.
          </Text>
          <Text style={styles.p}>
            By using the platform, you represent and warrant that you have the
            full right, power and authority to enter into these terms and to
            fully perform all of your obligations hereunder. You further
            represent and warrant that you are under no legal disability or
            contractual restriction that prevents you from entering into these
            terms.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>2. PROFESSIONALS</Text>
          <Text style={styles.h2}>2.1. User Registration and Verification</Text>
          <Text style={styles.p}>
            If you wish to become a professional user, you must read this
            agreement and indicate your acceptance during the registration
            process in order to be able to publish your services and your
            profile as a professional. Professional users can be licensed
            trainers, healers, therapists and nutritionists.
          </Text>
          <Text style={styles.p}>
            Professionals who register with Breakzen must have a professional
            license to offer their services through their profile.
          </Text>
          <Text style={styles.p}>
            Professionals must submit to a user verification process. If during
            the verification process the user does not provide and accredit the
            professional license, the user will not be admitted to the platform.
            Once the user and their respective professional license have been
            verified, they will be able to publish and offer their services
            through their profile and be contacted and hired by other users.
          </Text>
          <Text style={styles.p}>
            Professionals may submit to a background check process for a
            one-time fee ($11.99) through the platform, which must be paid
            during the registration process. The background check process is
            optional and once completed it will be visible and credited in the
            Professional's profile.
          </Text>
          <Text style={styles.p}>
            In consideration of your use of the Platform as a Professional, you
            represent that you are of legal age to form a binding contract under
            the laws of the United States or any applicable jurisdiction. You
            also agree to (a) provide true, accurate, current and complete
            information about yourself and your profile as a Professional as
            requested on the registration form available on Breakzen and (b)
            maintain and promptly update your registration data to keep it true,
            accurate, current and complete. If we have reasonable grounds to
            suspect that such information is untrue, inaccurate, not current or
            incomplete, Breakzen reserves the right to suspend or terminate your
            account, delete your user profile and refuse any and all current or
            future use of the platform at any time without notice.
          </Text>
          <Text style={styles.p}>
            Professionals may share personal and business information through
            the platform and the communication channels established on the
            platform. Any information that Professionals share through the
            platform is the sole responsibility of the Professionals themselves.
            Professionals are free to share information, but are responsible for
            the use of such information, its publication and disclosure.
            Breakzen is not responsible for the information posted and shared
            through the platform.
          </Text>
          <Text style={styles.h2}>2.2. Account</Text>
          <Text style={styles.p}>
            If you register on Breakzen, you will be required to choose a
            password, and you may be asked for additional information regarding
            your account. You are responsible for maintaining the
            confidentiality of your password and account information, and are
            fully responsible for all activities that occur under your password
            or account. You agree to (a) immediately notify Breakzen of any
            unauthorized use of your password or account or any other breach of
            security, and (b) ensure that you log out from your account at the
            end of each session. You may never use another User’s account
            without prior authorization from Breakzen. Breakzen will not be
            liable for any loss or damage arising from your failure to comply
            with this agreement.
          </Text>
          <Text style={styles.p}>
            By providing Breakzen with your email address and phone number you
            consent to our use of your email address to send you notices about
            the service and products. We may also use your email address and
            phone number to send you notifications, push notifications and other
            messages, such as changes to service features, news, and special
            content. If you do not wish to receive these emails, you may opt-out
            of receiving them by sending us your withdrawal request via the
            contact information or by using the "unsubscribe" option in the
            emails or mobile notifications. Opting out may prevent you from
            receiving emails about updates, news or special content.
          </Text>
          <Text style={styles.p}>
            Users may cancel their accounts at any time and for any reason by
            following the instructions on the platform or by sending us their
            request through our contact information. That termination will only
            result in the deletion of the account and the deletion of all the
            personal data granted to Breakzen.
          </Text>
          <Text style={styles.p}>
            Breakzen reserves the right to terminate your account or your access
            immediately, with or without notice to you, and without liability to
            you, if Breakzen believes that you have breached any of these terms,
            furnished Breakzen with false or misleading information, or
            interfered with use of the platform or the service by others.
          </Text>
          <Text style={styles.h2}>2.3. Subscriptions</Text>
          <Text style={styles.p}>
            Professional users must purchase a paid subscription in order to
            publish their profile and services through the platform.
          </Text>
          <Text style={styles.p}>
            Breakzen offers the following monthly and annual subscriptions:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              General Access: $19.99/month or $219.99/year
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Pro Access: $39.99/month or $439.99/year
            </Text>
          </View>
          <Text style={styles.p}>
            Please check the price and features of subscriptions before
            purchasing a subscription. When a user purchases a subscription,
            Breakzen will send a confirmation email. This confirmation email
            will occur automatically so that the user has confirmation of
            payment and initiation of the subscription. If the user does not
            receive the email, it may have been sent to their spam folder.
          </Text>
          <Text style={styles.p}>
            Breakzen may change or discontinue the availability of subscriptions
            at any time at its sole discretion. If a purchase is cancelled, the
            payment made for the subscription will be refunded in full. This
            does not affect your statutory rights.
          </Text>
          <Text style={styles.p}>
            Subscriptions may include automatic recurring payments. You
            authorize Breakzen to renew your subscription and charge you
            periodically and progressively on each billing date. The billing
            date will be every 30 days and will be determined by the date on
            which you register, purchase the subscription and make your first
            payment. On the corresponding billing date, the value of the fee
            will be automatically charged according to the subscription that the
            user has chosen during registration. Your subscription will continue
            until you cancel it or we terminate it. Users may cancel their
            subscription at any time. You must cancel your subscription before
            it renews to avoid the next billing period. We will bill the
            recurring subscription fee in the form of payment you provide to us
            during registration or subscription purchase. If you cancel your
            subscription, you may continue to use the platform and features
            included in the subscription until the next billing date.
          </Text>
          <Text style={styles.p}>
            Subscriptions will automatically renew for an additional period
            unless cancelled prior to the next billing period. If you wish to
            reactivate your subscription, you must purchase a new subscription.
          </Text>
          <Text style={styles.h2}>2.4. Payments</Text>
          <Text style={styles.p}>
            Subscriptions and background checks will be paid through Stripe
            (payment processor available on Breakzen). Subscriptions will be
            activated once the payment and registration process is completed.
            Payment will be charged to the credit/debit card immediately upon
            purchase of the subscription. Once the transaction has been
            processed, we will send you an electronic receipt of the transaction
            to the email address you provide.
          </Text>
          <Text style={styles.p}>
            If you find any inconsistency in your billing, please contact us
            through our contact information or you can make the claim through
            the customer service of the corresponding payment platform.
          </Text>
          <Text style={styles.p}>
            If your card is declined, you will receive an error message. No
            payment will be charged to your card and no order will be processed.
            There may be a pending transaction on your account until your card
            issuing bank withdraws the authorization. This usually takes 2 to 5
            business days. Your card may be declined for various reasons such as
            insufficient funds, AVS (Address Verification System) mismatch or
            you have entered an incorrect security code.
          </Text>
          <Text style={styles.p}>
            If your payment is declined, you must provide an alternative payment
            method or provide another card where payment can be charged and
            processed.
          </Text>
          <Text style={styles.p}>
            Your payment data will be treated and kept securely and with the
            sole purpose of processing the purchase of subscriptions and
            background checks. Breakzen reserves the right to contract any
            payment platform available in the market, which treats your data
            with the sole purpose of processing the purchase of subscriptions
            and background checks.
          </Text>
          <Text style={styles.h2}>2.5. Profiles</Text>
          <Text style={styles.p}>
            Your profile must include complete and accurate information about
            your services, their features, specifications, pricing and any
            special specifications or requirements that apply to the services.
            You are responsible for keeping your profile information and content
            (such as photos) current and accurate at all times.
          </Text>
          <Text style={styles.h2}>2.6. Independence of the Professionals</Text>
          <Text style={styles.p}>
            Breakzen does not direct, represent or control the services offered
            by the Professionals through the platform. The Professional accepts
            that he/she has full discretion to decide whether to offer the
            services through his/her profile and at what time he/she publishes
            and offers these services. The Professional may determine the price
            of the services it offers and publishes through the platform.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>3. CLIENTS</Text>
          <Text style={styles.h2}>3.1. Registration</Text>
          <Text style={styles.p}>
            If you wish to become a Client user, you must read this agreement
            and indicate your acceptance during the registration process in
            order to search and contact Professionals through the profiles
            published on our platform. The registration and use of the platform
            for Client users is completely free of charge.
          </Text>
          <Text style={styles.p}>
            In consideration of your use of the platform as a Client user, you
            represent that you are of legal age to form a binding contract under
            any applicable jurisdiction. You also agree to (a) provide true,
            accurate, current and complete information about yourself as
            requested in the registration form available on Breakzen and (b)
            maintain and promptly update your registration data to keep it true,
            accurate, current and complete. If we have reasonable grounds to
            suspect that such data is false, inaccurate, not updated or
            incomplete, Breakzen reserves the right to suspend or cancel your
            account and reject any current or future use of the platform at any
            time and without prior notice, if Breakzen considers that you have
            violated any provision of these terms and conditions.
          </Text>
          <Text style={styles.p}>
            Users may share personal and commercial information through the
            platform with other users. Any information that users share through
            the platform is the sole responsibility of the users themselves.
            Users are free to share information, but they are responsible for
            the use of said information, its publication and disclosure.
            Breakzen is not responsible for the information you provide and
            share through the platform. The information you provide and share
            through the platform is the sole and exclusive responsibility of the
            users.
          </Text>
          <Text style={styles.h2}>3.2. Account</Text>
          <Text style={styles.p}>
            If you register on Breakzen, you will be required to choose a
            password, and you may be asked for additional information regarding
            your account. You are responsible for maintaining the
            confidentiality of your password and account information, and are
            fully responsible for all activities that occur under your password
            or account. You agree to (a) immediately notify Breakzen of any
            unauthorized use of your password or account or any other breach of
            security, and (b) ensure that you log out from your account at the
            end of each session. You may never use another user’s account
            without prior authorization from Breakzen. Breakzen will not be
            liable for any loss or damage arising from your failure to comply
            with this agreement.
          </Text>
          <Text style={styles.p}>
            By providing Breakzen with your email address and phone number you
            consent to our use of your email address to send you notices about
            the service and products. We may also use your email address and
            phone number to send you notifications, push notifications and other
            messages, such as changes to service features, news, and special
            content. If you do not wish to receive these emails, you may opt-out
            of receiving them by sending us your withdrawal request via the
            contact information or by using the "unsubscribe" option in the
            emails or mobile notifications. Opting out may prevent you from
            receiving emails about updates, news or special content.
          </Text>
          <Text style={styles.p}>
            Users may cancel their accounts at any time and for any reason by
            following the instructions on the platform or by sending us their
            request through our contact information. That termination will only
            result in the deletion of the account and the deletion of all the
            personal data granted to Breakzen.
          </Text>
          <Text style={styles.p}>
            Breakzen reserves the right to terminate your account or your access
            immediately, with or without notice to you, and without liability to
            you, if Breakzen believes that you have breached any of these terms,
            furnished Breakzen with false or misleading information, or
            interfered with use of the platform or the service by others.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>4. OWNERSHIP AND LICENSES</Text>
          <Text style={styles.p}>
            The ownership rights of the platform and the methods used on the
            platform belong exclusively to Breakzen LLC. Any physical or virtual
            exposure of the methods used on the platform may result in
            violations of the intellectual property rights of Breakzen LLC.
          </Text>
          <Text style={styles.p}>
            Breakzen gives you a personal, worldwide, royalty-free,
            non-assignable and non-exclusive license to use the software
            (platform) provided to you by Breakzen as part of the services. This
            license is for the sole purpose of enabling you to use and enjoy the
            benefit of the services as provided by Breakzen, in the manner
            permitted by these terms. You may not copy, modify, distribute,
            sell, or lease any part of our services or included software, nor
            may you reverse engineer or attempt to extract the source code of
            that software, unless laws prohibit those restrictions, or you have
            our written permission.
          </Text>
          <Text style={styles.p}>
            This service prohibits sending of messages, that: (1) Any kind of
            messages that are catalogued as SPAM. (2) Are harassing, abusive,
            defamatory, obscene, in bad faith, unethical or otherwise illegal
            content (3) distribute trojans, viruses or other malicious computer
            software (4) Are intending to commit fraud, impersonating other
            persons, phishing, scams, or related crime (5) distribute
            intellectual property without ownership or a license to distribute
            such property (6) Breach, in any way, the terms of service, privacy
            policy or rules of this web site or the recipients.
          </Text>
          <Text style={styles.p}>
            The user agrees not to use the platform and the services
            negligently, for fraudulent purposes or in an unlawful manner.
            Likewise, the user agrees not to partake in any conduct or action
            that could damage the image, interests, or rights of the Breakzen
            platform or third parties.
          </Text>
          <Text style={styles.p}>
            Breakzen reserves the right to terminate your access immediately,
            with or without notice, and without liability to you, if Breakzen
            believes that you have violated any of these terms or interfered
            with the use of the platform or service by others.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>5. ADVERTISING</Text>
          <Text style={styles.p}>
            Through the platform Breakzen may make available to users,
            commercial and advertising information, own or third parties in
            accordance with good business practices. In these cases, Breakzen
            does not endorse, guarantee or commit its responsibility for the
            services and / or products marketed by these third parties, since
            the platform serves as a channel of communication and advertising,
            but not as a tool for the provision of services. Consequently, it is
            the full responsibility of the users to access the sites that refer
            advertising, assuming the obligation to verify and know the terms of
            the services offered by third parties.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>6. DISCLAIMER</Text>
          <Text style={styles.p}>
            The services or contents published and offered on the platform by
            the Professionals are not offered or provided by Breakzen.
            Breakzen's services are limited to providing the platform where the
            Professionals can publish their profile and services and can be
            found by other users interested in hiring their services.
          </Text>
          <Text style={styles.p}>
            The services offered by the Professionals through the platform and
            the content of their profiles are the sole and exclusive
            responsibility of the Professionals themselves. Although Breakzen
            performs the verification process and in some cases the background
            check process of the Professional users, Breakzen is not responsible
            for the quality, accuracy, security or legality of the services or
            content published and offered by the Professionals on the platform.
          </Text>
          <Text style={styles.p}>
            Breakzen does not offer any declaration or guarantee on the services
            or contents published by the Professionals through the platform. The
            use of the services or contents available in the platform is done at
            your own risk and responsibility.
          </Text>
          <Text style={styles.p}>
            Breakzen is not responsible for damages to the physical or moral
            integrity of persons, such as injuries, death or any other moral
            damage such as threats, insults and slander that may fall on a
            physical person as a consequence of the communications established
            in the platform. Communications and relationships established
            between users as a result of any connection within the platform are
            the sole and exclusive responsibility of the users.
          </Text>
          <Text style={styles.p}>
            In the case that one or several users or any third party initiates
            any type of claim or legal action against another or other users,
            each and every one of the users involved in said claims or actions
            exempt Breakzen from any responsibility.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>7. USER CONTENT </Text>
          <Text style={styles.p}>
            Some features of the platform allow users to upload and provide
            content and information through the platform. You retain any rights
            you may have in the content and information you share through the
            platform. By providing content through the platform, you authorize
            Breakzen to display and publish your content on the platform.
            Breakzen is not responsible for the accuracy, safety or legality of
            the content and information that the user provides and shares
            through the platform. You are solely and exclusively responsible for
            your content and information. Breakzen nor its directors, agents,
            employees and partners shall have any liability for the information
            or content provided by users through the platform.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>
            8. REPRESENTATIONS AND WARRANTIES FOR USER CONTENT
          </Text>
          <Text style={styles.p}>
            Breakzen disclaims all liability in relation to the content that
            users provide and post through the platform. You are solely
            responsible for your content and the consequences of providing
            content through the platform. By providing content through the
            platform, you affirm, represent and warrant that:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              You are the creator and owner of the content you post and
              provide through the platform, or have the necessary licenses,
              rights, consents and permissions to authorize Breakzen to post and
              display your content on the platform.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your content, and your use of your content as contemplated
              by these Terms, does not and will not: (i) infringe, violate or
              misappropriate any third party right, including any copyright,
              trademark, patent, trade secret, moral right, right of privacy,
              right of publicity or any other intellectual property or
              proprietary right; (ii) libel, defame, slander or invade the
              privacy, publicity or other proprietary rights of any other
              person; or (iii) cause Breakzen to violate any law or regulation.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your content must not contain information or content about
              politics or religion.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your content must relate solely to the services published
              on the platform. No other content is allowed.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your content may not be considered by a reasonable person
              to be objectionable, profane, indecent, pornographic, harassing,
              threatening, embarrassing, hateful or otherwise inappropriate.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your content does not and will not contain hateful
              content, threat of physical harm or harassment
            </Text>
          </View>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>9. USER CONTENT DISCLAIMER</Text>
          <Text style={styles.p}>
            We have no obligation to edit or monitor any content that you or
            other users provide through the platform, and we will not be in any
            way responsible for any content that users share and provide through
            the platform. However, Breakzen may, at any time and without notice,
            filter, remove, edit or block any user content that, in our
            judgment, violates these terms or is otherwise objectionable. You
            understand that, by using the platform, you will be exposed to
            content from a variety of sources and acknowledge that content that
            users share through the platform may be inaccurate, offensive,
            indecent or objectionable. You agree to waive, and do waive, any
            legal or equitable rights or remedies you have or may have against
            Breakzen with respect to the content that you and users provide
            through the platform.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>10. COPYRIGHT</Text>
          <Text style={styles.p}>
            All content included on this platform, such as text, graphics,
            logos, images, videos, audio clips, data compilations and software,
            is the property of Breakzen and its user content providers and is
            protected by international copyright laws. The compilation of all
            content on this site is the exclusive property of Breakzen and the
            user content providers and is protected by international copyright
            laws. All software used on this platform is the property of Breakzen
            or its software suppliers and is protected by international
            copyright laws. Users may publish and share content through the
            platform. By posting your content through Breakzen, you agree and
            consent that your content may be publicly displayed on the platform
            and may be shared by other users of the platform. By posting and
            sharing your content and that of other users, you also agree not to
            modify or remove, directly or indirectly, any copyright, trade name,
            service mark, trademark or any other property appearing in the
            content available on Breakzen. Any alteration or use of content
            outside the guidelines of these terms violates intellectual property
            rights and may be subject to claims or lawsuits. By accessing our
            platform, you do not have any right or title to the content
            available or other intellectual property.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>
            11. COPYRIGHT INFRINGEMENT (Digital Millennium Copyright Act)
          </Text>
          <Text style={styles.p}>
            Breakzen will respond to all inquiries, complaints and claims
            regarding alleged infringement for failure to comply with or
            violation of the provisions contained in the Digital Millennium
            Copyright Act. Breakzen respects the intellectual property of
            others, and expects users to do the same. If you believe, in good
            faith, that any material provided on or in connection with the
            Breakzen website infringes your copyright or other intellectual
            property right, please send us your copyright infringement request
            pursuant to Section 512 of the Digital Millennium Copyright Act, via
            our contact information, with the following information:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Identification of the intellectual property right that is
              allegedly infringed. All relevant registration numbers or a
              statement regarding ownership of the work should be included.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              A statement that specifically identifies the location of
              the infringing material, in sufficient detail so that Breakzen can
              find it on the "Breakzen" website. Note that providing a top-level
              URL is not sufficient.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your name, address, telephone number and email address.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              A statement by you that you have a good faith belief that
              the use of the allegedly infringing material is not authorized by
              the copyright owner, or its agents, or by law.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              A statement by you, made under penalty of perjury, that
              the information in your notification is accurate, and that you are
              the copyright owner or authorized to act on its behalf.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              An electronic or physical signature of the copyright owner
              or of the person authorized to act on the copyright owner's
              behalf.
            </Text>
          </View>
          <Text style={styles.p}>
            Upon receipt of a request for copyright infringement under the
            Copyright Act, Breakzen will contact the allegedly infringing user
            so that the user may respond to the request in accordance with the
            terms contained in the Digital Millennium Copyright Act.
          </Text>
          <Text style={styles.p}>
            Responses to copyright infringement requests must contain the
            following:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              The physical or electronic signature of the user;
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              The identification of the content that has been removed or
              the place where the content was posted;
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              A statement, under oath, indicating a good faith belief
              that the content or material was removed due to an error.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              The name, address and telephone number of the user; and
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              A statement that the user consents to the jurisdiction of
              the court in which the user is located.
            </Text>
          </View>
          <Text style={styles.p}>
            In the event that the alleged infringing user fails to respond to
            the copyright infringement request and the alleged copyright owner
            is able to satisfactorily prove ownership of such copyright in the
            content and requests removal of such content from the website,
            Breakzen will remove the content from the website immediately.
          </Text>
          <Text style={styles.p}>
            All copyright infringement requests and responses may be submitted
            through our contact information.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>12. BREAKZEN RESPONSIBILITIES</Text>
          <Text style={styles.p}>
            Breakzen provides and maintains the platform "as is", "as available"
            and does not promise that the use of the platform will be
            uninterrupted or totally free of errors.
          </Text>
          <Text style={styles.p}>
            We cannot offer any other warranties, conditions, or other terms,
            express or implied, statutory or otherwise, and all such terms are
            hereby excluded to the fullest extent permitted by law.
          </Text>
          <Text style={styles.p}>
            You shall be responsible for any breach of these terms by you and if
            you use the platform in violation of these terms you shall be liable
            and shall reimburse Breakzen for any loss or damage caused as a
            result.
          </Text>
          <Text style={styles.p}>
            Breakzen shall not be liable in any amount for the breach of any
            obligation under this agreement if such breach is caused by the
            occurrence of any unforeseen event beyond its reasonable control,
            including without limitation Internet outages, communications
            outages, fires, floods, wars or acts of God.
          </Text>
          <Text style={styles.p}>
            Subject to the foregoing, to the maximum extent permitted by law,
            Breakzen excludes liability for any loss or damage of any kind
            whatsoever, including without limitation any direct, indirect or
            consequential loss, whether or not arising from any problem you
            notify Breakzen and Breakzen shall have no liability to pay any
            money by way of compensation, including without limitation all
            liability in connection with:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Any incorrect or inaccurate information on Breakzen'
              platform.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              The infringement by any person of any intellectual
              property rights of any third party caused by the use of the
              platform or any product purchased through the platform.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Any loss or damage resulting from your use or inability to
              use the platform or resulting from unauthorized access to or
              alteration of your transmissions or data in circumstances beyond
              our control.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Any loss of profit, wastage, corruption or destruction of
              data or any other loss not directly resulting from something we
              have done wrong.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              All representations, warranties, conditions and other
              terms that would otherwise be effective are set forth in this
              notice.
            </Text>
          </View>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>13. PROHIBITED ACTIVITIES</Text>
          <Text style={styles.p}>
            The content and information available on the platform (including,
            but not limited to, data, information, text, music, sound, photos,
            graphics, video, maps, icons, or other material), as well as the
            infrastructure used to provide such content and information, are
            owned by or licensed to Breakzen by third parties. For all content
            other than your content, you agree not to modify, copy, distribute,
            transmit, display, perform, reproduce, publish, license, create
            derivative works from, transfer, or sell or resell any information
            or services obtained from or through the platform. In addition, the
            following activities are prohibited:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Access, monitor, reproduce, distribute, transmit,
              disseminate, display, sell, license, copy or otherwise exploit any
              content of the site, including, without limitation, using any
              robot, spider, scraper or other automated means or any manual
              process for any purpose that is not in accordance with this
              agreement or without our express written permission.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Take any action that imposes, or may impose, in our sole
              discretion, an unreasonable or disproportionately large load on
              our infrastructure.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Deep-link to any part of the application for any purpose
              without our express written permission.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Attempt to modify, translate, adapt, edit, decompile,
              disassemble or reverse engineer any software used by Breakzen.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Evade, disable or otherwise interfere with
              security-related features of the platform or features that prevent
              or restrict use or copying of any content.
            </Text>
          </View>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>14. INDEMNIFICATION</Text>
          <Text style={styles.p}>
            You agree to defend and indemnify Breakzen and any of their
            directors, employees and agents from and against any claims, causes
            of action, demands, recoveries, losses, damages, fines, penalties or
            other costs or expenses of any kind or nature including but not
            limited to reasonable legal and accounting fees, brought by third
            parties as a result of:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Your breach of this Agreement or the documents referenced
              herein.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your violation of any law or the rights of a third party.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your use of the platform.
            </Text>
          </View>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>15. ELECTRONIC COMMUNICATIONS</Text>
          <Text style={styles.p}>
            No responsibility will be accepted by Breakzen for failed, partial
            or garbled computer transmissions, for any computer, telephone,
            cable, network, electronic or internet hardware or software
            malfunctions, failures, connections, availability, for the acts or
            omissions of any service provider, internet accessibility or
            availability or for traffic congestion or unauthorized human act,
            including any errors or mistakes.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>16. CHANGES AND TERMINATION</Text>
          <Text style={styles.p}>
            We may change the platform and these Terms at any time, in our sole
            discretion and without notice to you. You are responsible for
            remaining knowledgeable about these Terms. Your continued use of the
            platform constitutes your acceptance of any changes to these Terms
            and any changes will supersede all previous versions of the Terms.
            Unless otherwise specified herein, all changes to these Terms apply
            to all users take effect. Furthermore, we may terminate this
            agreement with you under these Terms at any time by notifying you in
            writing (including by email) or without any warning.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>17. PERSONAL DATA</Text>
          <Text style={styles.p}>
            Any personal information you submit in connection with the use of
            the platform will be used in accordance with our Privacy Policy.
            Please refer to our Privacy Policy.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>18. INTEGRATION CLAUSE</Text>
          <Text style={styles.p}>
            This Agreement together with the Privacy Policy and any other legal
            notices published by Breakzen, shall constitute the entire agreement
            between you and Breakzen concerning and governs your use of the
            platform.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>19. DISPUTES</Text>
          <Text style={styles.p}>
            You agree that any dispute, claim or controversy arising out of or
            relating to the breach, termination, enforcement, interpretation or
            validity of these terms and conditions or the use of the platform
            shall be resolved by binding arbitration between you and Breakzen,
            provided that each party retains the right to bring an individual
            action in a court of competent jurisdiction.
          </Text>
          <Text style={styles.p}>
            In the event a dispute arises in connection with your use of the
            platform or breach of these terms and conditions, the parties agree
            to submit their dispute to arbitration resolution before a reputable
            arbitration organization, as mutually agreed by the parties and in
            accordance with applicable commercial arbitration rules.
          </Text>
          <Text style={styles.p}>
            You agree to initiate a formal dispute proceeding by sending us a
            communication through our contact information. Breakzen may choose
            to send you a written offer after receiving your initial
            communication. If we offer and send you a settlement offer and you
            do not accept the offer, or we are unable to resolve your dispute
            satisfactorily and you wish to continue with the dispute process,
            you must initiate the dispute resolution process before an
            accredited arbitration organization and file a separate Demand for
            Arbitration. Any award rendered by the arbitration tribunal shall be
            final and conclusive on the parties.
            {' '}
          </Text>
          <Text style={styles.p}>
            To the fullest extent permitted by law, you agree that you will not
            file, join or participate in any class action lawsuit in connection
            with any claim, dispute or controversy that may arise in connection
            with your use of the platform.
          </Text>
          <Text style={styles.p}>
            The arbitration courts and the courts of the State of New Jersey
            (United States) shall have jurisdiction to hear any claim or dispute
            regarding the use of the platform.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>20. FINAL PROVISIONS</Text>
          <Text style={styles.p}>
            These terms and conditions are governed by the laws of the United
            States. Use of our platform is unauthorized in any jurisdiction that
            does not give effect to all provisions of these Terms.
          </Text>
          <Text style={styles.p}>
            Our compliance with these Terms is subject to existing laws and
            legal process, and nothing contained in these Terms limits our right
            to comply with law enforcement or other governmental or legal
            requests or requirements relating to your use of our platform or
            information provided to or collected by us with respect to such use.
          </Text>
          <Text style={styles.p}>
            If any part of these Terms is held invalid, illegal or
            unenforceable, the validity, legality and enforceability of the
            remaining provisions shall not be affected or impaired in any way.
            Our failure to enforce or delay in enforcing any provision of these
            Terms at any time does not waive our right to enforce the same or
            any other provision in the future.
          </Text>
          <Text style={styles.p}>
            Any rights not expressly granted herein are reserved.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>21. CONTACT INFORMATION</Text>
          <Text style={styles.p}>
            If you have any questions or concerns about these Terms, please
            contact us using our contact information below:
          </Text>
          <Text style={styles.p}>Breakzen LLC.</Text>
          <Text style={styles.p}>Support@breakzen.com</Text>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

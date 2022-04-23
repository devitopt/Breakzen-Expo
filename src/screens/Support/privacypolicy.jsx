import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
} from 'react-native';
import { SupportHeader, styles } from './supportheader';

export default function PrivacyPolicy({ navigation }) {
  const bullet = '\u2B24   ';
  return (
    <View style={styles.container}>
      <SupportHeader title="Privacy Policy" navigation={navigation} />
      <ScrollView
        style={styles.scrollViewer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chapter}>
          <Text style={styles.h1}>Welcome to Breakzen!</Text>
          <Text style={styles.p}>
            Breakzen is owned and operated by Breakzen LLC.
          </Text>
          <Text style={styles.p}>
            Breakzen values your privacy and the protection of your personal
            data. This privacy policy describes what information we collect from
            you, how we collect it, how we use it, how we obtain your consent,
            how long we keep it in our databases and, if necessary, with whom we
            share it.
          </Text>
          <Text style={styles.p}>
            By registering and using the platform, you accept the practices
            described in this Privacy Policy. Your use of the platform is also
            subject to our Terms and Conditions.
          </Text>
          <Text style={styles.p}>
            This Privacy Policy may change from time to time. Your continued use
            of the platform after we make changes to this privacy policy is
            considered acceptance of those changes, so please check this policy
            periodically for updates. This Privacy Policy has been developed and
            is maintained in accordance with all applicable federal and
            international laws and regulations and specifically with the
            California Online Privacy Protection Act (CalOPPA – U.S regulation),
            New Jersey data protection laws and the General Data Protection
            Regulation (GDPR - European regulation).
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>1. GENERAL INFORMATION</Text>
          <Text style={styles.p}>
            The personal data of the users that are collected and processed
            through:
          </Text>
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
          <Text style={styles.p}>
            Will be under responsibility and in charge of:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Breakzen LLC.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              support@breakzen.com
            </Text>
          </View>
          <Text style={styles.p}>(Hereinafter referred to as “Breakzen”).</Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>2. TYPES OF INFORMATION GATHERED</Text>
          <Text style={styles.p}>
            The information we collect from our users helps us to effectively
            provide our platform and to personalize and continually improve the
            user experience on the platform. These are the types of information
            we collect:
          </Text>
          <Text style={styles.p}>
            Information You Give Us. You provide information when you provide,
            share, search, read, listen and view content through the platform,
            register as a user, use the platform's functionalities, purchase a
            subscription, complete the background check process and/or
            communicate with us through our contact information or our contact
            forms. As a result of those actions, you may provide us with the
            following information:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              First and last name
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Date of birth
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Email address
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Phone number (includes WhatsApp number)
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Location
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              User content (photos, videos, profile content)
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Validation ID
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              IP address
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Any additional information relating to you that you
              provide to us directly through our platform or indirectly through
              our platform or online presence such as ‘cookies’.
            </Text>
          </View>
          <Text style={styles.p}>
            Breakzen will not collect any personally identifiable information
            about you unless you provide it.
          </Text>
          <Text style={styles.p}>
            Information Collected Automatically: By accessing, registering, and
            using the platform and website you automatically provide us with the
            following information:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              The device and usage information you use to access the
              website
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your IP address
              {' '}
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Browser and device characteristics
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Operating system
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Referring URLs
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Your location
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              What parts of the website you use and how often.
            </Text>
          </View>
          <Text style={styles.p}>
            If you access the platform and website through a mobile phone, we
            will collect the following information:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Mobile device ID
              {' '}
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Model and manufacturer
              {' '}
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Operating system
              {' '}
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Version information
              {' '}
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              IP address
            </Text>
          </View>
          <Text style={styles.p}>
            Payment information: Your credit/debit card data or payment
            information will be processed by Stripe (payment processor available
            in Breakzen), which will process and store your data securely and
            with the sole purpose of processing the purchase of subscriptions
            and background checks. Breakzen reserves the right to hire any
            payment processor available in the market, which will treat your
            data with the sole purpose of processing the purchase of
            subscriptions and background checks.
          </Text>
          <Text style={styles.p}>See Stripe's privacy policy here:</Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              https://stripe.com/gb/privacy
            </Text>
          </View>
          <Text style={styles.p}>
            GOOGLE Analytics. We use Google Analytics provided by Google, Inc.,
            USA (“Google”). These tool and technologies collect and analyze
            certain types of information, including IP addresses, device, and
            software identifiers, referring and exit URLs, feature use metrics
            and statistics, media access control address (MAC Address), mobile
            unique device identifiers, and other similar information via the use
            of cookies. The information generated by Google Analytics (including
            your IP address) may be transmitted to and stored by Google on
            servers in the United States. We use the GOOGLE Analytics collection
            of data to enhance the platform and improve our service.
          </Text>
          <Text style={styles.p}>
            Please consult Google's privacy policy here:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              https://policies.google.com/privacy
            </Text>
          </View>
          <Text style={styles.p}>
            Facebook Pixel: Our platform uses Facebook pixels that enable us,
            our advertisers and service providers:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Collect statistics on our platforms and social networks
              (for example, number of users who visited a page).
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Collect information about how you interact with our
              platforms and social networks (e.g., whether you opened or
              followed links contained within).
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Personalize online services and marketing communications.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Match ads to users and optimize advertising campaigns.
            </Text>
          </View>
          <Text style={styles.p}>
            The information collected through the Facebook pixel will be
            collected and stored by Facebook and will be treated in accordance
            with its privacy policy. The information we collect through the
            Facebook pixel does not personally identify the user and will never
            be used for purposes other than those contained in this privacy
            policy and Facebook's privacy policy.
          </Text>
          <Text style={styles.p}>
            Please consult Facebook's privacy policy here:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              https://www.facebook.com/privacy/explanation
            </Text>
          </View>
          <Text style={styles.p}>
            Social Media: On our platform you will find links and functions
            linked to different social networks, where you can share your
            information. The user will also be able to share information from
            their social networks through the platform or when logging in
            through their social network accounts.
          </Text>
          <Text style={styles.p}>
            It is advisable to consult the privacy policy and data protection of
            each social media used on our platform.
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Facebook: https://www.facebook.com/privacy/explanation
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Instagram: http://instagram.com/about/legal/privacy/
            </Text>
          </View>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>3. HOW LONG WE KEEP YOUR DATA</Text>
          <Text style={styles.p}>
            Personal data provided by users through the platform will be
            retained for the time necessary to provide the platform and the
            functionalities available on the platform. Breakzen may be allowed
            to retain personal data for a longer period whenever the user has
            given consent to such processing, as long as such consent is not
            withdrawn. Furthermore, Breakzen may be obliged to retain personal
            data for a longer period whenever required to do so for the
            performance of a legal obligation or upon order of an authority.
            Once the retention period expires, personal data shall be deleted.
            Therefore, the right to access, the right to erasure, the right to
            rectification and the right to data portability cannot be enforced
            after expiration of the retention period.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>4. HOW WE USE YOUR INFORMATION. </Text>
          <Text style={styles.p}>
            In general, we use the information we collect primarily to provide,
            maintain, protect, and improve our current platform and services. We
            use personal information collected through our site as described
            below and described elsewhere in this Policy to:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Identify you as a user in our system.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Provide the platform (Available on Google Play and App
              store)
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              User registration.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              User verification.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Complete the background check process.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Publish the profile of the Professionals.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Publish and share user content.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Provide functionalities within the platform.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Facilitate the connection and communication between users.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Understand and enhance your experience using our platform.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Respond to your comments or questions through our support
              team.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Send you related information, including confirmations,
              invoices, technical notices, updates, security alerts and support
              and administrative messages.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Communicate with you about upcoming events, offers and
              news about content and services offered by Breakzen and our
              selected partners.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Marketing purposes of Breakzen.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Link or combine your information with other information we
              get from third parties to help understand your needs and provide
              you with better service.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Protect, investigate, and deter against fraudulent,
              unauthorized or illegal activity.
            </Text>
          </View>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>5. HOW DO YOU GET MY CONSENT?</Text>
          <Text style={styles.p}>
            By registering as a user, contributing and sharing content through
            the platform, purchasing a subscription, completing the background
            check process, using the functionalities available on the platform,
            using the communication channels available on the platform,
            communicating with us through the contact forms or our contact
            information, accepting the use of cookies by our website and
            providing personal information to us to communicate with you, you
            consent to our collection, storage and use of your information on
            the terms contained in this privacy policy. You may withdraw your
            consent by sending us your request via the contact information or
            the contact page.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>6. HOW WE SHARE INFORMATION</Text>
          <Text style={styles.p}>
            The personal information of our users is an important and
            fundamental part of our business. Under no circumstances will we
            sell or share information with third parties that has not been
            previously authorized by the user or owner of the personal data. We
            share user information only and exclusively as described below.
          </Text>
          <Text style={styles.p}>
            Third-Party Service Providers. We use the services of third parties
            to perform certain functions on the website. For example, creation
            and hosting of the website and platform, processing payments
            (Stripe), sending emails, analyzing data (Google Analytics),
            providing marketing services, and providing search results.
          </Text>
          <Text style={styles.p}>
            These third-party services and tools may have access to personal
            information needed to perform their functions but may not use that
            information for other purposes. Information shared with these
            third-party services will be treated and stored in accordance with
            their respective privacy policies and our privacy policy.
          </Text>
          <Text style={styles.p}>
            Business Transfers. In the event that Breakzen creates, merges with,
            or is acquired by another entity, your information will most likely
            be transferred. Breakzen will email you or place a prominent notice
            on our Platform before your information becomes subject to another
            privacy policy.
          </Text>
          <Text style={styles.p}>
            Protection of Breakzen and others. We release personal information
            when we believe release is appropriate to comply with the law,
            enforce or apply our Terms and conditions and other agreements, or
            protect the rights, property, or safety of Breakzen, our users or
            others. This includes exchanging information with other companies
            and organizations for fraud protection and credit risk reduction.
          </Text>
          <Text style={styles.p}>
            With Your Consent. Other than as set out above, you will receive
            notice when personally identifiable information about you might go
            to third parties, and you will have an opportunity to choose not to
            share the information.
          </Text>
          <Text style={styles.p}>
            Anonymous Information. Breakzen uses the anonymous browsing
            information collected automatically by our servers primarily to help
            us administer and improve the Platform. We may also use aggregated
            anonymous information to provide information about the Platform to
            potential business partners and other unaffiliated entities. This
            information is not personally identifiable.
          </Text>
          <Text style={styles.p}>
            Email Address. The email address that you supply to us for purposes
            of receiving our email communications will never be rented or sold
            to a third party.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>7. PROTECTING YOUR INFORMATION</Text>
          <Text style={styles.p}>
            Breakzen will make all reasonable efforts to protect the personal
            information of users it obtains, and the personal information will
            be protected by dedicated data security personnel. In order to
            prevent users' personal information from being illegally accessed,
            copied, modified, transmitted, lost, destroyed, processed or used in
            unexpected and unauthorized situations, Breakzen has and will
            continue to take the following measures to protect your personal
            information: 1) The user's personal information is encrypted and
            stored by adopting encryption technology, and is isolated by
            isolation technology. 2) When using personal information, such as
            personal information display and personal information association
            calculations, we will use a variety of data desensitization
            technologies including content replacement, encryption
            desensitization, etc. to enhance the security of personal
            information in use. 3) Establish a strict data use and access
            system, adopt strict data access authority control and multiple
            identity authentication technologies to protect personal
            information, and prevent data from being used in violation of
            regulations.
          </Text>
          <Text style={styles.p}>
            Other security measures taken to protect personal information 1)
            Manage and regulate the storage and use of personal information by
            establishing a data classification and grading system, data security
            management specifications, and data security development
            specifications. 2) Data security personnel are responsible for
            security emergency response to promote and protect personal
            information security. 3. Notification of personal information
            security incidents 1) In the event of a security incident caused by
            personal information, Breakzen will report the first incident to the
            corresponding competent authority, and immediately carry out
            troubleshooting and emergency measures.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>8. RIGHTS</Text>
          <Text style={styles.p}>
            Users who provide information through our platform, as data subjects
            and data owners, have the right to access, rectify, download, or
            delete their information, as well as to restrict and object to
            certain processing of their information. While some of these rights
            apply generally, others apply only in certain limited circumstances.
            We describe these rights below:
          </Text>
          <View style={styles.paragraph}>
            <Text style={styles.bullet}>
              {bullet}
              Access and portability: to access and know what
              information is stored in our servers, you can send us your request
              through our contact information.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Rectify, Restrict, Limit and Delete: You can also
              rectify, restrict, limit, or delete much of your information.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Right to be informed: Users of our platform will be
              informed, upon request, about what data we collect, how it is
              used, how long it is retained and whether it is shared with third
              parties.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Object: When we process your information based on our
              legitimate interests as explained above, or in the public
              interest, you may object to this processing in certain
              circumstances. In such cases, we will stop processing your
              information unless we have compelling legitimate reasons to
              continue processing it or where it is necessary for legal reasons.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Revoke consent: Where you have previously given your
              consent, such as to allow us to process and store your personal
              information, you have the right to revoke your consent to the
              processing and storage of your information at any time. For
              example, you may withdraw your consent by updating your settings.
              In certain cases, we may continue to process your information
              after you have withdrawn your consent if we have a legal basis for
              doing so or if your withdrawal of consent was limited to certain
              processing activities.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Complaint: If you wish to file a complaint about our use
              of your information (and without prejudice to any other rights you
              may have), you have the right to do so with your local supervisory
              authority. Users can exercise all these rights by contacting us
              through the contact information or the contact page.
            </Text>
            <Text style={styles.bullet}>
              {bullet}
              Rights related to automated decision-making, including
              profiling: platform users may request that we provide a copy of
              the automated processing activities we conduct if they believe
              that data is being unlawfully processed.
            </Text>
          </View>
          <Text style={styles.p}>
            Users or owners of the personal information they provide through the
            website and services may exercise these rights over their personal
            information at any time and without any limitation by sending us
            their request through our contact information.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>
            9. CHILDREN’S ONLINE PRIVACY PROTECTION
          </Text>
          <Text style={styles.p}>
            We comply with the requirements of the California Online Privacy
            Protection Act (CalOPPA – U.S regulation), New Jersey data
            protection laws and the General Data Protection Regulation (GDPR -
            European regulation), regarding the protection of the personal data
            of minors. We do not collect any information from anyone under the
            age of 13. Our platform is intended for people who are at least 13
            years of age or older. If you become aware that a minor has provided
            us with personal information, please contact us. If we become aware
            that a minor under the age of 13 has provided us with personal
            information without proper authorization from his/her parents or
            legal guardians, we will take steps to delete that information,
            terminate that person's account, and restrict access to that person.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>10. EDITING AND DELETING INFORMATION</Text>
          <Text style={styles.p}>
            If you believe that any information, we are holding on you is
            incorrect or incomplete, please write to or email us as soon as
            possible. We will promptly correct any information found to be
            incorrect. You can change, modify, rectify and delete your
            Information at any time, please contact us through the contact
            information. To opt-out of Breakzen email, follow the instructions
            included in the email. Your request should be processed within 48
            hours.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>11. THIRD PARTIES</Text>
          <Text style={styles.p}>
            Except as otherwise expressly included in this Privacy Policy, this
            document addresses only the use and disclosure of information
            Breakzen collects from you. If you disclose your information to
            others, whether other users or suppliers on Breakzen, different
            rules may apply to their use or disclosure of the information you
            disclose to them. Breakzen does not control the privacy policies of
            third parties, and you are subject to the privacy policies of those
            third parties where applicable. Breakzen is not responsible for the
            privacy or security practices of other platforms on the Internet,
            even those linked to or from the Breakzen site. Breakzen encourages
            you to ask questions before you disclose your personal information
            to others.
          </Text>
        </View>
        <View style={styles.chapter}>
          <Text style={styles.h1}>12. CONTACT US </Text>
          <Text style={styles.p}>
            If you have questions or concerns about these Privacy Policy and the
            handling and security of your data, please contact us through our
            contact page or via the contact information below:
          </Text>
          <Text style={styles.p}>Breakzen LLC.</Text>
          <Text style={styles.p}>support@breakzen.com</Text>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

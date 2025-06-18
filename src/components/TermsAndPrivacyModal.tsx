import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-300 flex items-center">
            {type === 'terms' ? (
              <>
                <FileText className="mr-2" />
                Terms of Service
              </>
            ) : (
              <>
                <Shield className="mr-2" />
                Privacy Policy
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          {type === 'terms' ? (
            <>
              <h3>1. Terms of Use</h3>
              <p>
                Welcome to MachineGod AI. By accessing and using our services, you agree to be bound by these Terms of Service.
              </p>

              <h3>2. Use License</h3>
              <p>
                Permission is granted to temporarily use the MachineGod AI system for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>

              <h3>3. Disclaimer</h3>
              <p>
                The materials on MachineGod AI's website and system are provided on an 'as is' basis. MachineGod AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h3>4. Limitations</h3>
              <p>
                In no event shall MachineGod AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MachineGod AI's website, even if MachineGod AI or a MachineGod AI authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h3>5. Accuracy of Materials</h3>
              <p>
                The materials appearing on MachineGod AI's website could include technical, typographical, or photographic errors. MachineGod AI does not warrant that any of the materials on its website are accurate, complete or current. MachineGod AI may make changes to the materials contained on its website at any time without notice.
              </p>

              <h3>6. Links</h3>
              <p>
                MachineGod AI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MachineGod AI of the site. Use of any such linked website is at the user's own risk.
              </p>

              <h3>7. Modifications</h3>
              <p>
                MachineGod AI may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>

              <h3>8. Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>

              <h3>9. Subscription Terms</h3>
              <p>
                Subscription fees are charged on a monthly basis. You can cancel your subscription at any time, but no refunds will be provided for the current billing period. Upon cancellation, your account will remain active until the end of the current billing period.
              </p>

              <h3>10. API Usage</h3>
              <p>
                API usage is limited based on your subscription tier. Exceeding your API limit may result in rate limiting or temporary suspension of API access until the next billing cycle. You may upgrade your subscription at any time to increase your API limits.
              </p>
            </>
          ) : (
            <>
              <h3>1. Introduction</h3>
              <p>
                At MachineGod AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>

              <h3>2. Information We Collect</h3>
              <p>
                We collect information that you provide directly to us, such as when you create an account, update your profile, use interactive features, request customer support, or otherwise communicate with us.
              </p>
              <p>
                This may include:
              </p>
              <ul>
                <li>Personal information (name, email address)</li>
                <li>Account credentials</li>
                <li>Profile information</li>
                <li>Payment information</li>
                <li>Communications and correspondence</li>
                <li>User-generated content</li>
              </ul>

              <h3>3. Automatically Collected Information</h3>
              <p>
                When you access or use our Service, we automatically collect certain information, including:
              </p>
              <ul>
                <li>Device information (hardware model, operating system, unique device identifiers)</li>
                <li>Log information (IP address, browser type, pages viewed)</li>
                <li>Usage data (features used, actions taken)</li>
                <li>Performance data (error reports, diagnostic data)</li>
              </ul>

              <h3>4. How We Use Your Information</h3>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Develop new products and services</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraud and other illegal activities</li>
                <li>Personalize and improve your experience</li>
              </ul>

              <h3>5. Data Retention</h3>
              <p>
                We retain your information for as long as your account is active or as needed to provide you services. You can export or delete your data at any time through your account settings.
              </p>

              <h3>6. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>

              <h3>7. Your Rights</h3>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>

              <h3>8. GDPR Compliance</h3>
              <p>
                For users in the European Economic Area (EEA), we process your personal data in accordance with the General Data Protection Regulation (GDPR). We act as a data controller for the information you provide directly to us.
              </p>

              <h3>9. Changes to This Privacy Policy</h3>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>

              <h3>10. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@machinegod.ai.
              </p>

              <p className="text-sm text-gray-400 mt-8">Last Updated: June 1, 2025</p>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
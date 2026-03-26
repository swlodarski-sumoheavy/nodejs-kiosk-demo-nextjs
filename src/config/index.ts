import { Environment } from 'bitpay-sdk';
import applicationData from '../../application.yaml';

export interface IConfig {
  bitpay: {
    token: string;
    notificationEmail: string;
    environment: Environment;
    mode: 'standard' | 'donation';
    design: {
      hero: {
        bgColor: string;
        title: string;
        body: string;
      };
      logo: string;
      posData: {
        fields: {
          type: string;
          required: boolean;
          id: string;
          name: string;
          label: string;
          currency?: string;
          options: {
            id: string;
            label: string;
            value: string;
          }[];
        }[];
      };
    };
    donation: {
      denominations: number[];
      footerText: string;
      enableOther: boolean;
      buttonSelectedBgColor: string;
      buttonSelectedTextColor: string;
      buyer: {
        fields: {
          type: string;
          required: boolean;
          id: string;
          name: string;
          label: string;
          currency?: string;
          options: {
            id: string;
            label: string;
            value: string;
          }[];
        }[];
      };
      posData: {
        fields: {
          type: string;
          required: boolean;
          id: string;
          name: string;
          label: string;
          currency?: string;
          options: {
            id: string;
            label: string;
            value: string;
          }[];
        }[];
      };
    };
  };
}

const config: IConfig = {
  ...applicationData,
};

export default config;

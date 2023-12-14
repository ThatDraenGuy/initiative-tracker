import { Image, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const qrPath = '../../../icon/qr.png';

const HomeScreen = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.home' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Space
        direction="vertical"
        size="small"
        style={{ flex: 1, overflow: 'auto' }}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflow: 'auto',
          }}
        >
          <div style={{ textAlign: 'center', width: '80%' }}>
            <h1>{t('app-name')}</h1>
            <h2>{t('about')}</h2>
            <p>{t('dnd')}</p>
            <h2>{t('purpose')}</h2>
            <p>{t('head')}</p>
            <h2>{t('license')}</h2>
            <p>{t('license-text')}</p>
            <Image src={qrPath} style={{ width: '25%' }} />
          </div>
        </Row>
      </Space>
      <div style={{ textAlign: 'center', color: 'gray', marginTop: 'auto' }}>
        <p>{t('all-rights-reserved')}</p>
      </div>
    </div>
  );
};

export default HomeScreen;

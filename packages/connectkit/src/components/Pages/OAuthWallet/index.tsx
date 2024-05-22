import { ModalContent, PageContent } from '../../Common/Modal/styles';
import { OAuthList } from '../../Common/OAuthList';

const OAuthWallet = () => {
  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 0 }}>
        <OAuthList />
      </ModalContent>
    </PageContent>
  );
};
export default OAuthWallet;

import SitePage from '../../components/SitePage.jsx';
import WhyLabGrownContent from '../../components/whylabgrown/WhyLabGrownContent.jsx';

export const metadata = {
  title: 'Why Lab-Grown Diamonds? | Caritas Luxury',
  description: 'Discover why lab-grown diamonds are a beautiful and thoughtful alternative. Same brilliance, same hardness, grown in a laboratory.',
};

export default function WhyLabGrownPage() {
  return (
    <SitePage
      currentPath="/why-lab-grown"
      pageTitle="Why Lab-Grown Diamonds"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <WhyLabGrownContent />
    </SitePage>
  );
}

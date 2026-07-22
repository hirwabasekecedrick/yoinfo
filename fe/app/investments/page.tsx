import { Suspense } from 'react';
import InvestmentsContent from './investments-content';

export default function InvestmentsPage() {
  return (
    <Suspense>
      <InvestmentsContent />
    </Suspense>
  );
}

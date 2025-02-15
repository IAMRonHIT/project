import { MembersChartGrid } from './components/MembersChartGrid';
import { MembersTable } from './components/MembersTable';
import { useNavigate } from 'react-router-dom';

export function MembersPage() {
  const navigate = useNavigate();

  const handleMemberClick = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-dark-gun-metal dark:text-white">Members Overview</h1>
        <p className="text-dark-gun-metal/60 dark:text-white/60 mt-1">
          Comprehensive view of all member activities and metrics
        </p>
      </div>

      <div>
        <MembersChartGrid />
      </div>
      
      <div className="mt-8">
        <MembersTable onMemberClick={handleMemberClick} />
      </div>
    </div>
  );
}

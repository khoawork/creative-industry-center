import React, { useState, useEffect, useMemo } from 'react';
import { ForumPageAPI } from '../api/forumApi.js';
import { AwardAPI } from '../api/awardApi.js';
import {
  ForumHeader,
  ForumHero,
  ForumPillars,
  ForumSpeakers,
  ForumAgenda,
  ForumAwards,
  ForumPartners,
  ForumRegistration,
  ForumFooter,
} from '../components/Forum';
import { Loader2 } from 'lucide-react';

export default function ForumPage() {
  const [forumData, setForumData] = useState(null);
  const [allDbAwards, setAllDbAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [pageRes, awardsRes] = await Promise.allSettled([
          ForumPageAPI.getForumPage(8),
          AwardAPI.getAwards({ per_page: 100 }),
        ]);

        if (isMounted) {
          if (pageRes.status === 'fulfilled' && pageRes.value?.data) {
            setForumData(pageRes.value.data);
          }

          if (awardsRes.status === 'fulfilled') {
            const list = Array.isArray(awardsRes.value?.data)
              ? awardsRes.value.data
              : Array.isArray(awardsRes.value)
              ? awardsRes.value
              : [];
            setAllDbAwards(list);
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu Diễn đàn Kinh tế:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter awards that were selected in admin
  const selectedAwards = useMemo(() => {
    const awardIds = forumData?.props?.awards_section?.award_ids;
    if (!Array.isArray(awardIds) || awardIds.length === 0) {
      return [];
    }
    // Match string or number IDs
    return allDbAwards.filter((aw) =>
      awardIds.some((id) => String(id) === String(aw.id))
    );
  }, [forumData, allDbAwards]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001947] flex flex-col items-center justify-center text-white">
        <Loader2 size={40} className="animate-spin text-amber-400 mb-4" />
        <p className="text-sm tracking-widest uppercase font-semibold text-blue-200">
          Đang nạp dữ liệu Diễn đàn Kinh tế Kỷ lục...
        </p>
      </div>
    );
  }

  const props = forumData?.props || {};

  return (
    <div className="min-h-screen bg-[#f7fafe] text-[#181c1f] flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900">
      <ForumHeader
        data={props.header_section}
        onRegister={() => setRegistrationOpen(true)}
      />

      <main className="flex-grow">
        <ForumHero data={props.hero_section} />
        <ForumPillars data={props.pillars_section} />
        <ForumSpeakers data={props.speakers_section} />
        <ForumAgenda data={props.agenda_section} />
        <ForumAwards data={props.awards_section} dbAwards={selectedAwards} />
        <ForumPartners data={props.partners_section} />
      </main>

      <ForumRegistration
        data={props.registration_section}
        isOpen={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
      />
      <ForumFooter data={props} />
    </div>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";

import { FeedPage } from "@/components/pages/FeedPage";
import { EventsPage } from "@/components/pages/EventsPage";
import { MissionsPage } from "@/components/pages/MissionsPage";
import { ForumPage } from "@/components/pages/ForumPage";
import { ForumThreadPage } from "@/components/pages/ForumThreadPage";
import { CommunityPage } from "@/components/pages/CommunityPage";
import { MembersPage } from "@/components/pages/MembersPage";
import { MemberProfilePage } from "@/components/pages/MemberProfilePage";
import { BlogPage } from "@/components/pages/BlogPage";
import { BlogPostPage } from "@/components/pages/BlogPostPage";
import { CapsulesPage } from "@/components/pages/CapsulesPage";
import { CapsuleDetailPage } from "@/components/pages/CapsuleDetailPage";
import { RecommendedPage } from "@/components/pages/RecommendedPage";
import { ToolsPage } from "@/components/pages/ToolsPage";
import { ProfilePage } from "@/components/pages/ProfilePage";
import { AdminPage } from "@/components/pages/AdminPage";

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <TooltipProvider>
        <BrowserRouter>
          <AuthGuard>
            <Routes>
              <Route element={<AppLayout />}>
                {/* Plataforma */}
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/missions" element={<MissionsPage />} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/forum/:threadId" element={<ForumThreadPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/members/:memberId" element={<MemberProfilePage />} />

                {/* Contenido */}
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/capsules" element={<CapsulesPage />} />
                <Route path="/capsules/:capsuleId" element={<CapsuleDetailPage />} />
                <Route path="/recommended" element={<RecommendedPage />} />
                <Route path="/tools" element={<ToolsPage />} />

                {/* Personal */}
                <Route path="/profile" element={<ProfilePage />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Routes>
          </AuthGuard>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

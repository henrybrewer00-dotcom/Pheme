# Deployment Checklist

Quick checklist to get Pheme running in production.

## Pre-Deployment

### Database Setup
- [ ] Supabase project created
- [ ] `supabase-schema.sql` executed successfully
- [ ] All tables created (verify with `SELECT * FROM articles LIMIT 1;`)
- [ ] Supabase URL and anon key copied

### API Keys
- [ ] Anthropic API key obtained
- [ ] API key has sufficient credits ($5 free = ~5000 summaries)
- [ ] Keys saved securely (password manager recommended)

### Environment Configuration
- [ ] `.env.local` created from `.env.example`
- [ ] All environment variables filled in correctly
- [ ] No placeholder values remaining

### Local Testing
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] App accessible at http://localhost:3000
- [ ] At least one test article added
- [ ] AI summary generation tested

## Vercel Deployment

### Repository Setup
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is public or Vercel has access
- [ ] `.env.local` is in `.gitignore` (DO NOT commit secrets!)

### Vercel Configuration
- [ ] Vercel account created
- [ ] Project imported from repository
- [ ] Build settings configured (Next.js auto-detected)
- [ ] Environment variables added:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `NEXT_PUBLIC_APP_URL` (set to Vercel domain)

### Deployment
- [ ] Initial deployment successful
- [ ] Build logs show no errors
- [ ] Production URL accessible
- [ ] Test article creation in production
- [ ] Dark mode working
- [ ] Search functionality working

## Post-Deployment

### Testing
- [ ] Create test article via API
- [ ] Generate AI summary
- [ ] Test all navigation links
- [ ] Verify mobile responsiveness
- [ ] Check dark mode toggle
- [ ] Test search functionality
- [ ] Verify bookmark feature
- [ ] Test author following

### Performance
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Images loading properly

### Monitoring
- [ ] Vercel Analytics enabled (optional)
- [ ] Error tracking set up (optional)
- [ ] Supabase monitoring checked

## Ongoing Maintenance

### Weekly
- [ ] Check Anthropic API usage
- [ ] Review Supabase database size
- [ ] Monitor error logs

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Review and optimize database queries
- [ ] Clean up old notifications

## Optional Enhancements

- [ ] Set up automated news fetching (cron job/Vercel cron)
- [ ] Add user authentication
- [ ] Implement email notifications
- [ ] Set up custom domain
- [ ] Add SEO meta tags
- [ ] Implement rate limiting
- [ ] Add sitemap.xml

## Emergency Contacts

- Supabase Support: https://supabase.com/support
- Anthropic Support: https://support.anthropic.com
- Vercel Support: https://vercel.com/support
- Next.js Docs: https://nextjs.org/docs

---

**Status**: 
- [ ] Development Complete
- [ ] Local Testing Complete
- [ ] Deployed to Vercel
- [ ] Production Testing Complete
- [ ] Ready for Use ✅

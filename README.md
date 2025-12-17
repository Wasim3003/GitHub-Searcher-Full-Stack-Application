# GitHub-Searcher-Full-Stack-Application


Overview

GitHub Searcher is a full-stack web application that allows users to search GitHub users and repositories through a clean, responsive interface.
The application is built as a single-page app with a Django REST backend and Redis caching to ensure performance and reliability.

The focus of this solution is clarity, efficiency, and user experience, while following the given technical requirements closely.

High-Level Architecture
React (Vite SPA)
     |
     |  POST /api/search/
     |
Django REST API
     |
     |  Cached responses (Redis – 2 hours)
     |
GitHub Search API

Frontend Solution (React)
Approach
Built as a single-page application using React and Vite for fast development and hot reload.
State is managed using React hooks (useState) since the application scope is small and does not require Redux or complex state management.
Styling is implemented using vanilla CSS as required, without external UI frameworks.

Key UI Decisions
1. Center-to-Top Search Animation
On initial load and when the input is empty, the search bar is centered vertically.
When the user starts typing, the search bar smoothly animates upward.
When the input is cleared, it smoothly returns to the center.

Reason:
This improves focus on the primary action (search) and provides a polished, modern user experience.

The animation is implemented using:
transform: translateY() for smooth GPU-accelerated motion
A spacer element to preserve layout flow and prevent content jumping

2. Smooth and Stable UI Transitions
A spacer div is used to reserve vertical space during animation.
This prevents layout shifts when results appear.
Card click focus issues are handled to prevent animation flicker.
Reason:
Transform-based animations do not affect layout flow by default. The spacer ensures stability and a professional feel.

3. Search Behavior
API calls are triggered only when the input has at least 3 characters.
Changing the dropdown (Users / Repositories) refreshes results automatically.
Clearing the input clears results and resets the UI.

Reason:
This minimizes unnecessary requests and matches expected search behavior.

4. Result Cards & Navigation
Clicking a user card opens the GitHub user profile.
Clicking a repository card opens the GitHub repository page.
Links open in a new tab.

Reason:
The GitHub API already provides html_url, allowing direct navigation without additional routing logic.
Backend Solution (Django + DRF)
API Design
A single endpoint /api/search/ handles both user and repository searches.

The endpoint accepts:

{
  "query": "react",
  "type": "users" | "repositories"
}

GitHub API Integration
Uses GitHub Search API with proper headers:
User-Agent (required by GitHub)
Accept header for JSON responses
Includes request timeouts to avoid hanging connections.

Reason:
Ensures reliability and avoids GitHub API rejections or rate-limit issues.
Caching Strategy (Redis)
Design
Redis is used as a caching layer with a 2-hour TTL.

Cache key format:
github:<type>:<query>
If cached data exists, GitHub API is not called again.
Fault Tolerance
Redis access is wrapped in try/except blocks.
If Redis is unavailable, the backend continues to function normally.

Reason:
This improves performance, avoids repeated API calls, and ensures backend stability
Error Handling & Edge Cases
Invalid requests return meaningful HTTP error responses.
Short search queries are rejected early.
GitHub API failures return safe error messages.
Redis failures do not crash the application.

Technical Decisions & Rationale
Decision	Reason
React + Vite	Fast dev experience and lightweight SPA
Django REST Framework	Clean API structure and validation
Redis caching	Reduce GitHub API calls and latency
Vanilla CSS	Requirement compliance and simplicity
No Redux	Application state is simple
Transform-based animation	Smooth performance and modern UX
Spacer layout fix	Prevents layout jump during animation
Conclusion

This solution prioritizes:

Clean architecture
Performance through caching
Smooth and intuitive user experience
Maintainable and readable code
All core requirements are implemented, with additional attention paid to UI polish, stability, and real-world edge cases.

Author:
Full Stack Developer
GitHub Searcher Project

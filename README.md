Part 1: Overview & User Roles
1. Overview
Objective: Create a survey marketplace where:

Clients initiate surveys.

Vendors participate by completing surveys.

An admin manages surveys and user accounts.

Technology:

Backend: Supabase (PostgreSQL, authentication, RLS).

Frontend: React.

2. Key Concepts
User Approval: Users sign up as vendors or clients; their accounts are inactive until approved by an admin.

Category Binding: Vendors are assigned a category upon approval. This determines which surveys they can access.

Security: Supabase RLS is used to ensure vendors only see surveys in their category.

3. User Roles & Dashboards
Admin
Responsibilities:

Approve vendors/clients.

Manage surveys (create, edit, delete).

Dashboard Tabs:

Surveys

Vendors

Clients

New Feature – Category Selection for Vendors:
When approving vendors, the admin can select one of these predefined categories:

Automobile

Food & Beverage

Ethnicity

Business & Occupation

Healthcare Consumer

Healthcare Professional

Mobile

Smoking

Household

Education

Electronic

Gaming

Mother & Baby

Media

Travel

Hobbies & Interests

Vendor
Workflow:

Sign up as vendor (record created with flag 'no').

Get approved and assigned a category.

Dashboard Tabs:

Metrics: Key performance stats.

Analysis: Detailed analytics.

Marketplace: Displays surveys filtered by vendor category.

Client
Workflow:

Sign up as client (record created with flag 'no').

Get approved by an admin.

Dashboard Tabs:

Surveys: Lists surveys created/assigned.

Metrics: Performance metrics.

Analysis: Survey performance insights.

Part 2: Database Schema
1. Users Table
Fields:

id (UUID)

email

role (vendor, client, admin)

flag (approval status: default 'no')

category (set by admin; for vendors, one of the predefined list)

created_at

SQL Example:

sql
Copy
Edit
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('vendor', 'client', 'admin')),
  flag text DEFAULT 'no',
  category text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE users
ADD CONSTRAINT flag_category_check
CHECK (flag = 'no' OR (flag = 'yes' AND category IS NOT NULL));
2. Surveys Table
Fields:

id (UUID)

title & description

category (must match vendor category)

created_by (admin or client)

created_at

SQL Example:

sql
Copy
Edit
CREATE TABLE surveys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  category text,
  created_by uuid REFERENCES users (id),
  created_at timestamp with time zone DEFAULT now()
);
3. Optional Additional Tables
Survey Responses/Analytics: Record vendor responses and clicks.

Audit Logs: Track admin actions such as user approvals and survey updates.

Part 3: Supabase Features & Backend Implementation
1. Authentication & User Management
Sign-Up Flow:
Use Supabase Authentication to register users (default flag = 'no' and no category).

Admin Approval Flow:
The admin reviews pending registrations and approves them by setting flag = 'yes' and assigning a category from the predefined list.

Optional Stored Procedure:

sql
Copy
Edit
CREATE OR REPLACE FUNCTION approve_user(p_user_id uuid, p_category text)
RETURNS VOID AS $$
BEGIN
  IF p_category IS NULL THEN
    RAISE EXCEPTION 'A valid category must be provided to approve the user.';
  END IF;
  UPDATE users
  SET flag = 'yes', category = p_category
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
2. Row Level Security (RLS) Policies
For Vendors:
Vendors only see surveys where the survey’s category matches their assigned category.

sql
Copy
Edit
CREATE POLICY vendor_survey_access ON surveys
FOR SELECT
USING (category = (SELECT category FROM users WHERE id = auth.uid()));
For Clients and Admins:
Create policies so that clients see only their surveys and admins have full access.

Part 4: Frontend Implementation (React)
1. Pages & Components
Landing Page: Overview and navigation (sign-up/sign-in).

Sign-Up Page:
Option to choose role (vendor/client) and capture additional details.

Sign-In Page:
Authenticate the user; if not approved, show “Pending Approval” message.

2. Dashboard Pages
Admin Dashboard
Surveys Tab: Create, edit, and delete surveys; select a survey category from the predefined list.

Vendors Tab:
Approve vendor accounts and assign a category using a drop-down menu.

Clients Tab:
Approve client accounts.

Vendor Dashboard
Metrics Tab: Displays key performance metrics.

Analysis Tab: Detailed survey analytics.

Marketplace Tab: Lists surveys that match the vendor’s category; if mismatched, display a “Not eligible” message.

Client Dashboard
Surveys Tab: Lists surveys created or assigned.

Metrics Tab: Performance metrics.

Analysis Tab: Survey performance insights.

3. API Integration
Using Supabase Client Library in React:

javascript
Copy
Edit
const { data: surveys, error } = await supabase
  .from('surveys')
  .select('*')
  .eq('category', currentUser.category);
4. Survey Link Binding
Survey URL Generation:
The admin generates a unique URL for each survey that holds the survey’s category.

Access Control:
When a vendor accesses a survey, validate the vendor’s category against the survey’s category; otherwise, display an eligibility error.

Part 5: Registration Details Enhancement
1. Client Registration
Collect and store the following details:

Name (Required)

Website

Email (Required)

Company Name (Required)

Account Email (Required)

Contact Number

HSN SAC

GST (Required)

Country

Region

City (Required)

2. Vendor Registration
Collect the same details as for clients:

Name (Required)

Website

Email (Required)

Company Name (Required)

Account Email (Required)

Contact Number

HSN SAC

GST (Required)

Country

Region

City (Required)

Part 6: Final Deliverables & Implementation Outline
1. Final Deliverables
Database Setup: SQL scripts for users and surveys tables, including RLS policies and stored procedures.

Frontend Application:
A complete React project for landing, signup, sign-in, and dashboards (admin, vendor, client) with Supabase integration.

Documentation:
A README with system architecture, setup steps, and API documentation for custom functions or endpoints.

2. Step-by-Step Implementation Outline
Plan & Design:
Define roles, fields, and data flow; create UI wireframes.

Database Setup:
Create the tables and RLS policies in Supabase.

Backend Implementation:
Integrate Supabase Authentication and implement user approval logic.

Frontend Implementation:
Build the React pages (Landing, Sign-Up, Sign-In) and dashboards.
Integrate Supabase for data operations and implement survey link validation.

Registration Form Enhancement:
Update signup forms to capture the required details.

Testing & Deployment:
Test for each user role; deploy the application.

Final Documentation:
Complete README and API documentation.
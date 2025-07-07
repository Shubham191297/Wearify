--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying(255) NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: sthapliyal
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "shoppingBagId" text,
    password text,
    "resetToken" text,
    "resetTokenExpiration" timestamp with time zone
);


ALTER TABLE public.users OWNER TO sthapliyal;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sthapliyal
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO sthapliyal;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sthapliyal
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sthapliyal
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sthapliyal
--

COPY public.users (id, name, email, "createdAt", "updatedAt", "shoppingBagId", password, "resetToken", "resetTokenExpiration") FROM stdin;
10	AdminUser	admin@app.com	2024-10-07 22:51:58.046+05:30	2024-10-07 22:51:58.046+05:30	\N	$2a$12$pn1/t2YdAuhsZPeNua7lA.phFz3uqZjy6Yf2SOzRmrZyl8zevuMmK	\N	\N
22	Kittu	stuti6jan@gmail.com	2024-10-11 17:59:16.952+05:30	2024-10-11 17:59:16.952+05:30	\N	$2a$12$zjf8/ZM0FL4gFmdCWDGG6OoEjcw0Afky2Ltms3iFVmTFiMQ9Kfg.S		\N
11	Mehul	mehul@gmail.com	2024-10-10 16:08:58.551+05:30	2024-10-10 16:09:09.079+05:30	6707aecded5a4e9601858d13	$2a$12$ZCZsgu7NeHoTQrLaVHBNmesvysyVDt0YVbd/R.gpXWAYL7UGqJPC.	\N	\N
26	suresh98	suresh@gmail.com	2024-10-16 02:16:23.225+05:30	2024-10-16 02:16:23.225+05:30	\N	$2a$12$m2SfywRV0nu9Se9MVZsH/ulB9KBOO7QV3FeTjHpCIWLb2vq.m3USq	\N	\N
21	Shubham	thapliyalshubham8@gmail.com	2024-10-11 02:08:18.209+05:30	2025-07-07 18:58:25.338+05:30	670928407744ade65d3895bb	$2a$12$STJo1jw2S1f6G1OdaEWncOQrGtxdR9bMCP4s2F5zUwfNYu2Y/r66O	\N	\N
25	angu9719	sthapliyal1912@gmail.com	2024-10-16 02:04:16.076+05:30	2025-07-07 19:11:26.743+05:30	\N	$2a$12$LAio3UutvX6TztlFegi7zem.LmyNMZ2npUUmqREBkq8m0zGVd/g4K	\N	\N
23	Manish	balonishradha@gmail.com	2024-10-16 00:14:19.141+05:30	2025-07-07 19:25:24.949+05:30	670eb8473b850bf5b354b75a	$2a$12$4R7dRxgopP7tTKI2/xcx5ODLYbz2KwLxZfoT2I9GNMgA5mzeGe8Xi	\N	\N
8	Mudit	mudit@gmail.com	2024-10-03 22:49:14.306+05:30	2025-07-07 18:33:48.559+05:30	66ffe9b3efcc46973aa6d728	mudit123	d406a22dba4cbd825187b8cdaf33cbc2d8a98dd9b545bffa373fc2ad47682a3d	2025-07-07 19:33:48.558+05:30
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sthapliyal
--

SELECT pg_catalog.setval('public.users_id_seq', 26, true);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sthapliyal
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


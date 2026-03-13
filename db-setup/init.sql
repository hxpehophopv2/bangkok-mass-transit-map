--
-- PostgreSQL database dump
--

\restrict QjIeVXC9QVQICSHYfOTteuGIVwlGccJINMpAty7goQLPrsclQeRlVFLGWPtQumW

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.3 (Debian 18.3-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.line (
    line_id character varying(15) NOT NULL,
    th_name character varying(100) NOT NULL,
    th_name_alt character varying(100),
    en_name character varying(100) NOT NULL,
    en_name_alt character varying(100),
    color character varying(7) NOT NULL,
    operator character varying(50) NOT NULL
);


ALTER TABLE public.line OWNER TO postgres;

--
-- Name: station; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.station (
    station_id character varying(50) NOT NULL,
    line_id character varying(10),
    th_name character varying(100) NOT NULL,
    en_name character varying(100) NOT NULL,
    is_available boolean DEFAULT true NOT NULL
);


ALTER TABLE public.station OWNER TO postgres;

--
-- Name: station_connection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.station_connection (
    source_station_id character varying(50) NOT NULL,
    target_station_id character varying(50) NOT NULL,
    travel_time_mins integer NOT NULL,
    is_transfer boolean DEFAULT false,
    is_cross_op boolean DEFAULT false
);


ALTER TABLE public.station_connection OWNER TO postgres;

--
-- Data for Name: line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.line (line_id, th_name, th_name_alt, en_name, en_name_alt, color, operator) FROM stdin;
BL	สีน้ำเงิน	เฉลิมรัชมงคล	Blue	Chaleom Ratchamongkhon	#243E8C	BEM
PP	สีม่วง	ฉลองรัชธรรม	Purple	Chalong Ratchadham	#863A8E	BEM
SUK	สุขุมวิท	สีเขียวอ่อน	Sukhumvit	Light Green	#78B928	BTSC
SIL	สีลม	สีเขียวเข้ม	Silom	Dark Green	#00722A	BTSC
SUK_EXT	สุขุมวิท (ส่วนต่อขยาย)	สีเขียวอ่อน (ส่วนต่อขยาย)	Sukhumvit (Extension)	Light Green (Extension)	#78B928	BTSC_EXT
SIL_EXT	สีลม (ส่วนต่อขยาย)	สีเขียวเข้ม (ส่วนต่อขยาย)	Silom (Extension)	Dark Green (Extension)	#00722A	BTSC_EXT
RN	สีแดงเข้ม	ธานีรัถยา	Dark Red	Thani Ratthaya	#B62126	SRTET
RW	สีแดงอ่อน	นครวิถี	Light Red	Nakhon Withi	#FF5252	SRTET
PK	สีชมพู	วิวัฒน์นคร	Pink	Wiwat Nakhon	#EA6589	NBM
YL	สีเหลือง	นัคราพิพัฒน์	Yellow	Nakkhara Phiphat	#FAD508	EBM
ARL	แอร์พอร์ต เรล ลิงก์	ท่าอากาศยาน	Airport Rail Link	Airport	#6E1137	AERA1
G	สีทอง	\N	Gold	\N	#A6882F	BTSC_G
\.


--
-- Data for Name: station; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.station (station_id, line_id, th_name, en_name, is_available) FROM stdin;
CEN_Sukhumvit	SUK	สยาม	Siam	t
N1	SUK	ราชเทวี	Ratchathewi	t
N2	SUK	พญาไท	Phaya Thai	t
N3	SUK	อนุสาวรีย์ชัยสมรภูมิ	Victory Monument	t
N4	SUK	สนามเป้า	Sanam Pao	t
N5	SUK	อารีย์	Ari	t
N7	SUK	สะพานควาย	Saphan Khwai	t
N8	SUK	หมอชิต	Mo Chit	t
N9	SUK_EXT	ห้าแยกลาดพร้าว	Ha Yaek Lat Phrao	t
N10	SUK_EXT	พหลโยธิน 24	Phahon Yothin 24	t
N11	SUK_EXT	รัชโยธิน	Ratchayothin	t
N12	SUK_EXT	เสนานิคม	Sena Nikhom	t
N13	SUK_EXT	มหาวิทยาลัยเกษตรศาสตร์	Kasetsart University	t
N14	SUK_EXT	กรมป่าไม้	Royal Forest Department	t
N15	SUK_EXT	บางบัว	Bang Bua	t
N16	SUK_EXT	กรมทหารราบที่ 11	11th Infantry Regiment	t
N17	SUK_EXT	วัดพระศรีมหาธาตุ	Wat Phra Sri Mahathat	t
N18	SUK_EXT	พหลโยธิน 59	Phahon Yothin 59	t
N19	SUK_EXT	สายหยุด	Sai Yud	t
N20	SUK_EXT	สะพานใหม่	Saphan Mai	t
N21	SUK_EXT	โรงพยาบาลภูมิพลอดุลยเดช	Bhumibol Adulyadej Hospital	t
N22	SUK_EXT	พิพิธภัณฑ์กองทัพอากาศ	Royal Thai Air Force Museum	t
N23	SUK_EXT	แยก คปอ.	Yaek Kor Por Aor	t
N24	SUK_EXT	คูคต	Khu Khot	t
E1	SUK	ชิดลม	Chit Lom	t
E2	SUK	เพลินจิต	Phloen Chit	t
E3	SUK	นานา	Nana	t
E4	SUK	อโศก	Asok	t
E5	SUK	พร้อมพงษ์	Phrom Phong	t
E6	SUK	ทองหล่อ	Thong Lo	t
E7	SUK	เอกมัย	Ekkamai	t
E8	SUK	พระโขนง	Phra Khanong	t
E9	SUK	อ่อนนุช	On Nut	t
E10	SUK_EXT	บางจาก	Bang Chak	t
E11	SUK_EXT	ปุณณวิถี	Punnawithi	t
E12	SUK_EXT	อุดมสุข	Udom Suk	t
E13	SUK_EXT	บางนา	Bang Na	t
E14	SUK_EXT	แบริ่ง	Bearing	t
E15	SUK_EXT	สำโรง	Samrong	t
E16	SUK_EXT	ปู่เจ้า	Pu Chao	t
E17	SUK_EXT	ช้างเอราวัณ	Chang Erawan	t
E18	SUK_EXT	โรงเรียนนายเรือ	Royal Thai Naval Academy	t
E19	SUK_EXT	ปากน้ำ	Pak Nam	t
E20	SUK_EXT	ศรีนครินทร์	Srinagarindra	t
E21	SUK_EXT	แพรกษา	Phraek Sa	t
E22	SUK_EXT	สายลวด	Sai Luat	t
E23	SUK_EXT	เคหะฯ	Kheha	t
W1	SIL	สนามกีฬาแห่งชาติ	National Stadium	t
CEN_Silom	SIL	สยาม	Siam	t
S1	SIL	ราชดำริ	Ratchadamri	t
S2	SIL	ศาลาแดง	Sala Daeng	t
S3	SIL	ช่องนนทรี	Chong Nonsi	t
S4	SIL	เซนต์หลุยส์	Saint Louis	t
S5	SIL	สุรศักดิ์	Surasak	t
S6	SIL	สะพานตากสิน	Saphan Taksin	t
S7	SIL	กรุงธนบุรี	Krung Thonburi	t
S8	SIL	วงเวียนใหญ่	Wongwian Yai	t
S9	SIL_EXT	โพธิ์นิมิตร	Pho Nimit	t
S10	SIL_EXT	ตลาดพลู	Talat Phlu	t
S11	SIL_EXT	วุฒากาศ	Wutthakat	t
S12	SIL_EXT	บางหว้า	Bang Wa	t
BL01_U	BL	ท่าพระ	Tha Phra	t
BL02	BL	จรัญฯ 13	Charan 13	t
BL03	BL	ไฟฉาย	Fai Chai	t
BL04	BL	บางขุนนนท์	Bang Khun Non	t
BL05	BL	บางยี่ขัน	Bang Yi Khan	t
BL06	BL	สิรินธร	Sirindhorn	t
BL07	BL	บางพลัด	Bang Phlat	t
BL08	BL	บางอ้อ	Bang O	t
BL09	BL	บางโพ	Bang Pho	t
BL10	BL	เตาปูน	Tao Poon	t
BL11	BL	บางซื่อ	Bang Sue	t
BL12	BL	กำแพงเพชร	Kamphaeng Phet	t
BL13	BL	สวนจตุจักร	Chatuchak Park	t
BL14	BL	พหลโยธิน	Phahon Yothin	t
BL15	BL	ลาดพร้าว	Lat Phrao	t
BL16	BL	รัชดาภิเษก	Ratchadaphisek	t
BL17	BL	สุทธิสาร	Sutthisan	t
BL18	BL	ห้วยขวาง	Huai Kwang	t
BL19	BL	ศุนย์วัฒนธรรมแห่งประเทศไทย	Thailand Cultural Centre	t
BL20	BL	พระราม 9	Phra Ram 9	t
BL21	BL	เพชรบุรี	Phetchaburi	t
BL22	BL	สุขุมวิท	Sukhumvit	t
BL23	BL	ศูนย์การประชุมแห่งชาติสิริกิติ์	Queen Sirikit National Convention Centre	t
BL24	BL	คลองเตย	Khlong Toei	t
BL25	BL	ลุมพินี	Lumphini	t
BL26	BL	สีลม	Si Lom	t
BL27	BL	สามย่าน	Sam Yan	t
BL28	BL	หัวลำโพง	Hua Lamphong	t
BL29	BL	วัดมังกร	Wat Mangkon	t
BL30	BL	สามยอด	Sam Yot	t
BL31	BL	สนามไชย	Sanam Chai	t
BL32	BL	อิสรภาพ	Itsaraphap	t
BL01_L	BL	ท่าพระ	Tha Phra	t
BL33	BL	บางไผ่	Bang Phai	t
BL34	BL	บางหว้า	Bang Wa	t
BL35	BL	เพชรเกษม 48	Phetkasem 48	t
BL36	BL	ภาษีเจริญ	Phasi Charoen	t
BL37	BL	บางแค	Bang Khae	t
BL38	BL	หลักสอง	Lak Song	t
PP01	PP	คลองบางไผ่	Khlong Bang Phai	t
PP02	PP	ตลาดบางใหญ่	Talad Bang Yai	t
PP03	PP	สามแยกบางใหญ่	Sam Yaek Bang Yai	t
PP04	PP	บางพลู	Bang Phlu	t
PP05	PP	บางรักใหญ่	Bang Rak Yai	t
PP06	PP	บางรักน้อย-ท่าอิฐ	Bang Rak Noi Tha It	t
PP07	PP	ไทรม้า	Sai Ma	t
PP08	PP	สะพานพระนั่งเกล้า	Phra Nang Klao Bridge	t
PP09	PP	แยกนนทบุรี 1	Yaek Nonthaburi 1	t
PP10	PP	บางกระสอ	Bang Krasor	t
PP11	PP	ศูนย์ราชการนนทบุรี	Nonthaburi Civic Center	t
PP12	PP	กระทรวงสาธารณสุข	Ministry of Public Health	t
PP13	PP	แยกติวานนท์	Yaek Tiwanon	t
PP14	PP	วงศ์สว่าง	Wong Sawang	t
PP15	PP	บางซ่อน	Bang Son	t
PP16	PP	เตาปูน	Tao Poon	t
A1	ARL	สุวรรณภูมิ	Suvarnabhumi	t
A2	ARL	ลาดกระบัง	Lat Krabang	t
A3	ARL	บ้านทับช้าง	Ban Thap Chang	t
A4	ARL	หัวหมาก	Hua Mak	t
A5	ARL	รามคำแหง	Ramkhamhaeng	t
A6	ARL	มักกะสัน	Makkasan	t
A7	ARL	ราชปรารภ	Ratchaprarop	t
A8	ARL	พญาไท	Phaya Thai	t
RN01	RN	กรุงเทพอภิวัฒน์	Krung Thep Aphiwat	t
RN02	RN	จตุจักร	Chatuchak	t
RN03	RN	วัดเสมียนนารี	Wat Samian Nari	t
RN04	RN	บางเขน	Bang Khen	t
RN05	RN	ทุ่งสองห้อง	Thung Song Hong	t
RN06	RN	หลักสี่	Lak Si	t
RN07	RN	การเคหะ	Kan Kheha	t
RN08	RN	ดอนเมือง	Don Mueang	t
RN09	RN	หลักหก	Lak Hok	t
RN10	RN	รังสิต	Rangsit	t
RW01	RW	กรุงเทพอภิวัฒน์	Krung Thep Aphiwat	t
RW02	RW	บางซ่อน	Bang Son	t
RW05	RW	บางบำหรุ	Bang Bamru	t
RW06	RW	ตลิ่งชัน	Taling Chan	t
G1	G	กรุงธนบุรี	Krung Thon Buri	t
G2	G	เจริญนคร	Charoen Nakhon	t
G3	G	คลองสาน	Khlong San	t
PK01	PK	ศูนย์ราชการนนทบุรี	Nonthaburi Civic Center	t
PK02	PK	แคราย	Khae Rai	t
PK03	PK	สนามบินน้ำ	Sanambin Nam	t
PK04	PK	สามัคคี	Samakkhi	t
PK05	PK	กรมชลประทาน	Royal Irrigation Departmant	t
PK06	PK	แยกปากเกร็ด 	Yaek Pak Kret	t
PK07	PK	เลี่ยงเมืองปากเกร็ด	Pak Kret Bypass	t
PK08	PK	แจ้งวัฒนะ-ปากเกร็ด 28	Chaeng Watthana-Pak Kret 28	t
PK09	PK	ศรีรัช	Si Rat	t
PK10_L	PK	เมืองทองธานี	Muang Thong Thani	t
PK10_U	PK	เมืองทองธานี	Muang Thong Thani	t
PK11	PK	แจ้งวัฒนะ 14	Chaeg Watthana 14	t
PK12	PK	ศูนย์ราชการเฉลิมพระเกียรติ	Government Complex	t
PK13	PK	โทรคมนาคมแห่งชาติ	National Telecom	t
PK14	PK	หลักสี่	Lak Si	t
PK15	PK	ราชภัฏพระนคร	Rajabhat Phranakhon	t
PK16	PK	วัดพระศรีมหาธาตุ	Wat Phra Sri Mahathat	t
PK17	PK	รามอินทรา 3	Ram Inthra 3	t
PK18	PK	ลาดปลาเค้า	Lat Pla Khao	t
PK19	PK	รามอินทรา กม.4	Ram Inthra Kor Mor 4	t
PK20	PK	มัยลาภ	Maiyalap	t
PK21	PK	วัชรพล	Vacharaphol	t
PK22	PK	รามอินทรา กม.6	Ram Inthra Kor Mor 6	t
PK23	PK	คู้บอน	Khu Bon	t
PK24	PK	รามอินทรา กม.9	Ram Inthra Kor Mor 9	t
PK25	PK	วงแหวนรามอินทรา	Outer Ring Road-Ram Inthra	t
PK26	PK	นพรัตน์	Nopparat	t
PK27	PK	บางชัน	Bang Chan	t
PK28	PK	เศรษฐบุตรบำเพ็ญ	Setthabutbamphen	t
PK29	PK	ตลาดมีนบุรี	Min Buri Market	t
PK30	PK	มีนบุรี	Min Buri	t
MT01	PK	อิมแพ็ค เมืองทองธานี	Impact Muang Thong Thani	t
MT02	PK	ทะเลสาบเมืองทองธานี	Lake Muang Thong Thani	t
YL01	YL	ลาดพร้าว	Lat Phrao	t
YL02	YL	ภาวนา	Phawana	t
YL03	YL	โชคชัย 4	Chok Chai 4	t
YL04	YL	ลาดพร้าว 71	Lat Phrao 71	t
YL05	YL	ลาดพร้าว 83	Lat Phrao 83	t
YL06	YL	มหาดไทย	Mahat Thai	t
YL07	YL	ลาดพร้าว 101	Lat Phrao 101	t
YL08	YL	บางกะปิ	Bang Kapi	t
YL09	YL	แยกลำสาลี	Yaek Lam Sali	t
YL10	YL	ศรีกรีฑา	Si Kritha	t
YL11	YL	หัวหมาก	Hua Mak	t
YL12	YL	กลันตัน	Kalantan	t
YL13	YL	ศรีนุช	Si Nut	t
YL14	YL	ศรีนครินทร์ 38	Srinagarindra 38	t
YL15	YL	สนามหลวง ร.9	Suan Luang Rama IX	t
YL16	YL	ศรีอุดม	Si Udom	t
YL17	YL	ศรีเอี่ยม	Si lam	t
YL18	YL	ศรีลาซาล	Si La Salle	t
YL19	YL	ศรีแบริ่ง	Si Bearing	t
YL20	YL	ศรีด่าน	Si Dan	t
YL21	YL	ศรีเทพา	Si Thepha	t
YL22	YL	ทิพวัล	Thipphawan	t
YL23	YL	สำโรง	Samrong	t
N6	SUK	เสนาร่วม	Sena Ruam	f
RW03	RW	สะพานพระราม 6	Rama VI Bridge	f
RW04	RW	บางกรวย	Bang Kruai	f
\.


--
-- Data for Name: station_connection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.station_connection (source_station_id, target_station_id, travel_time_mins, is_transfer, is_cross_op) FROM stdin;
CEN_Sukhumvit	N1	2	f	f
CEN_Sukhumvit	E1	2	f	f
CEN_Sukhumvit	CEN_Silom	1	t	f
N1	CEN_Sukhumvit	2	f	f
N1	N2	2	f	f
N2	N1	2	f	f
N2	N3	2	f	f
N2	A8	2	t	t
N3	N2	2	f	f
N3	N4	3	f	f
N4	N3	3	f	f
N4	N5	1	f	f
N5	N4	1	f	f
N5	N6	2	f	f
N6	N5	2	f	f
N6	N7	1	f	f
N7	N6	1	f	f
N7	N8	1	f	f
N8	N7	1	f	f
N8	N9	4	f	f
N8	BL13	3	t	t
N9	N8	4	f	f
N9	N10	2	f	f
N9	BL14	5	t	t
N10	N9	2	f	f
N10	N11	1	f	f
N11	N10	1	f	f
N11	N12	2	f	f
N12	N11	2	f	f
N12	N13	1	f	f
N13	N12	1	f	f
N13	N14	2	f	f
N14	N13	2	f	f
N14	N15	1	f	f
N15	N14	1	f	f
N15	N16	2	f	f
N16	N15	2	f	f
N16	N17	2	f	f
N17	N16	2	f	f
N17	N18	2	f	f
N17	PK16	4	t	t
N18	N17	2	f	f
N18	N19	1	f	f
N19	N18	1	f	f
N19	N20	2	f	f
N20	N19	2	f	f
N20	N21	2	f	f
N21	N20	2	f	f
N21	N22	2	f	f
N22	N21	2	f	f
N22	N23	1	f	f
N23	N22	1	f	f
N23	N24	3	f	f
N24	N23	3	f	f
E1	CEN_Sukhumvit	2	f	f
E1	E2	2	f	f
E2	E1	2	f	f
E2	E3	2	f	f
E3	E2	2	f	f
E3	E4	2	f	f
E4	E3	2	f	f
E4	E5	2	f	f
E4	BL22	4	t	t
E5	E4	2	f	f
E5	E6	2	f	f
E6	E5	2	f	f
E6	E7	2	f	f
E7	E6	2	f	f
E7	E8	2	f	f
E8	E7	2	f	f
E8	E9	2	f	f
E9	E8	2	f	f
E9	E10	2	f	f
E10	E9	2	f	f
E10	E11	1	f	f
E11	E10	1	f	f
E11	E12	2	f	f
E12	E11	2	f	f
E12	E13	2	f	f
E13	E12	2	f	f
E13	E14	2	f	f
E14	E13	2	f	f
E14	E15	3	f	f
E15	E14	3	f	f
E15	E16	1	f	f
E15	YL23	4	t	t
E16	E15	1	f	f
E16	E17	3	f	f
E17	E16	3	f	f
E17	E18	3	f	f
E18	E17	3	f	f
E18	E19	1	f	f
E19	E18	1	f	f
E19	E20	3	f	f
E20	E19	3	f	f
E20	E21	2	f	f
E21	E20	2	f	f
E21	E22	2	f	f
E22	E21	2	f	f
E22	E23	2	f	f
E23	E22	2	f	f
W1	CEN_Silom	1	f	f
CEN_Silom	W1	1	f	f
CEN_Silom	S1	3	f	f
CEN_Silom	CEN_Sukhumvit	1	t	f
S1	CEN_Silom	3	f	f
S1	S2	3	f	f
S2	S1	3	f	f
S2	S3	2	f	f
S2	BL26	4	t	t
S3	S2	2	f	f
S3	S4	2	f	f
S4	S3	2	f	f
S4	S5	1	f	f
S5	S4	1	f	f
S5	S6	2	f	f
S6	S5	2	f	f
S6	S7	3	f	f
S7	S6	3	f	f
S7	S8	1	f	f
S8	S7	1	f	f
S8	S9	2	f	f
S9	S8	2	f	f
S9	S10	2	f	f
S10	S9	2	f	f
S10	S11	2	f	f
S11	S10	2	f	f
S11	S12	2	f	f
S12	S11	2	f	f
S12	BL34	2	t	t
BL01_U	BL02	2	f	f
BL01_U	BL01_L	1	t	f
BL02	BL01_U	2	f	f
BL02	BL03	2	f	f
BL03	BL02	2	f	f
BL03	BL04	2	f	f
BL04	BL03	2	f	f
BL04	BL05	3	f	f
BL05	BL04	3	f	f
BL05	BL06	2	f	f
BL06	BL05	2	f	f
BL06	BL07	2	f	f
BL07	BL06	2	f	f
BL07	BL08	2	f	f
BL08	BL07	2	f	f
BL08	BL09	2	f	f
BL09	BL08	2	f	f
BL09	BL10	2	f	f
BL10	BL09	2	f	f
BL10	BL11	2	f	f
BL10	PP16	1	t	f
BL11	BL10	2	f	f
BL11	BL12	2	f	f
BL11	RN01	3	t	t
BL11	RW01	3	t	t
BL12	BL11	2	f	f
BL12	BL13	2	f	f
BL13	BL12	2	f	f
BL13	BL14	3	f	f
BL13	N8	3	t	t
BL14	BL13	3	f	f
BL14	BL15	2	f	f
BL15	BL14	2	f	f
BL15	BL16	2	f	f
BL15	YL01	4	t	t
BL16	BL15	2	f	f
BL16	BL17	2	f	f
BL17	BL16	2	f	f
BL17	BL18	2	f	f
BL18	BL17	2	f	f
BL18	BL19	2	f	f
BL19	BL18	2	f	f
BL19	BL20	3	f	f
BL20	BL19	3	f	f
BL20	BL21	1	f	f
BL21	BL20	1	f	f
BL21	BL22	2	f	f
BL21	A6	3	t	t
BL22	BL21	2	f	f
BL22	BL23	3	f	f
BL22	E4	4	t	t
BL23	BL22	3	f	f
BL23	BL24	2	f	f
BL24	BL23	2	f	f
BL24	BL25	2	f	f
BL25	BL24	2	f	f
BL25	BL26	1	f	f
BL26	BL25	1	f	f
BL26	BL27	2	f	f
BL26	S2	4	t	t
BL27	BL26	2	f	f
BL27	BL28	2	f	f
BL28	BL27	2	f	f
BL28	BL29	2	f	f
BL29	BL28	2	f	f
BL29	BL30	2	f	f
BL30	BL29	2	f	f
BL30	BL31	2	f	f
BL31	BL30	2	f	f
BL31	BL32	2	f	f
BL32	BL31	2	f	f
BL32	BL01_L	3	f	f
BL01_L	BL32	3	f	f
BL01_L	BL33	1	f	f
BL01_L	BL01_U	1	t	f
BL33	BL01_L	1	f	f
BL33	BL34	2	f	f
BL34	BL33	2	f	f
BL34	BL35	2	f	f
BL34	S12	2	t	t
BL35	BL34	2	f	f
BL35	BL36	2	f	f
BL36	BL35	2	f	f
BL36	BL37	2	f	f
BL37	BL36	2	f	f
BL37	BL38	2	f	f
BL38	BL37	2	f	f
PP01	PP02	2	f	f
PP02	PP01	2	f	f
PP02	PP03	3	f	f
PP03	PP02	3	f	f
PP03	PP04	2	f	f
PP04	PP03	2	f	f
PP04	PP05	2	f	f
PP05	PP04	2	f	f
PP05	PP06	3	f	f
PP06	PP05	3	f	f
PP06	PP07	2	f	f
PP07	PP06	2	f	f
PP07	PP08	2	f	f
PP08	PP07	2	f	f
PP08	PP09	3	f	f
PP09	PP08	3	f	f
PP09	PP10	2	f	f
PP10	PP09	2	f	f
PP10	PP11	2	f	f
PP11	PP10	2	f	f
PP11	PP12	4	f	f
PP11	PK01	5	t	t
PP12	PP11	4	f	f
PP12	PP13	2	f	f
PP13	PP12	2	f	f
PP13	PP14	3	f	f
PP14	PP13	3	f	f
PP14	PP15	3	f	f
PP15	PP14	3	f	f
PP15	PP16	2	f	f
PP15	RW02	3	t	t
PP16	PP15	2	f	f
PP16	BL10	1	t	f
A1	A2	5	f	f
A2	A1	5	f	f
A2	A3	5	f	f
A3	A2	5	f	f
A3	A4	4	f	f
A4	A3	4	f	f
A4	A5	4	f	f
A4	YL11	4	t	t
A5	A4	4	f	f
A5	A6	4	f	f
A6	A5	4	f	f
A6	A7	3	f	f
A6	BL21	3	t	t
A7	A6	3	f	f
A7	A8	1	f	f
A8	A7	1	f	f
A8	N2	2	t	t
RN01	RN02	3	f	f
RN01	RW01	2	t	f
RN01	BL11	2	t	t
RN02	RN01	3	f	f
RN02	RN03	2	f	f
RN03	RN02	2	f	f
RN03	RN04	2	f	f
RN04	RN03	2	f	f
RN04	RN05	2	f	f
RN05	RN04	2	f	f
RN05	RN06	3	f	f
RN06	RN05	3	f	f
RN06	RN07	2	f	f
RN06	PK14	6	t	t
RN07	RN06	2	f	f
RN07	RN08	2	f	f
RN08	RN07	2	f	f
RN08	RN09	4	f	f
RN09	RN08	4	f	f
RN09	RN10	3	f	f
RN10	RN09	3	f	f
RW01	RW02	4	f	f
RW01	RN01	2	t	f
RW01	BL11	2	t	t
RW02	RW01	4	f	f
RW02	RW03	2	f	f
RW02	PP15	3	t	t
RW03	RW02	2	f	f
RW03	RW04	2	f	f
RW04	RW03	2	f	f
RW04	RW05	3	f	f
RW05	RW04	3	f	f
RW05	RW06	5	f	f
RW06	RW05	5	f	f
G1	S7	3	t	t
G1	G2	4	f	f
G2	G1	4	f	f
G2	G3	2	f	f
G3	G2	2	f	f
PK01	PK02	2	f	f
PK01	PP11	5	t	t
PK02	PK01	2	f	f
PK02	PK03	2	f	f
PK03	PK02	2	f	f
PK03	PP04	2	f	f
PK04	PK03	2	f	f
PK04	PK05	2	f	f
PK05	PK04	2	f	f
PK05	PK06	2	f	f
PK06	PK05	2	f	f
PK06	PK07	2	f	f
PK07	PK06	2	f	f
PK07	PK08	2	f	f
PK08	PK07	2	f	f
PK08	PK09	2	f	f
PK09	PK08	2	f	f
PK09	PK10_L	3	f	f
PK10_L	PK09	3	f	f
PK10_L	PK11	2	f	f
PK10_L	PK10_U	1	t	f
PK10_U	MT01	4	f	f
PK10_U	PK10_L	1	t	f
PK11	PK10_L	2	f	f
PK11	PK12	2	f	f
PK12	PK11	2	f	f
PK12	PK13	2	f	f
PK13	PK12	2	f	f
PK13	PK14	2	f	f
PK14	PK13	2	f	f
PK14	PK15	1	f	f
PK14	RN06	6	t	t
PK15	PK14	1	f	f
PK15	PK16	2	f	f
PK16	PK15	2	f	f
PK16	PK17	2	f	f
PK16	N17	4	t	t
PK17	PK16	2	f	f
PK17	PK18	2	f	f
PK18	PK17	2	f	f
PK18	PK19	2	f	f
PK19	PK18	2	f	f
PK19	PK20	2	f	f
PK20	PK19	2	f	f
PK20	PK21	2	f	f
PK21	PK20	2	f	f
PK21	PK22	2	f	f
PK22	PK21	2	f	f
PK22	PK23	2	f	f
PK23	PK22	2	f	f
PK23	PK24	2	f	f
PK24	PK23	2	f	f
PK24	PK25	2	f	f
PK25	PK24	2	f	f
PK25	PK26	2	f	f
PK26	PK25	2	f	f
PK26	PK27	3	f	f
PK27	PK26	3	f	f
PK27	PK28	2	f	f
PK28	PK27	2	f	f
PK28	PK29	2	f	f
PK29	PK28	2	f	f
PK29	PK30	2	f	f
PK30	PK29	2	f	f
MT01	MT02	2	f	f
MT01	PK10_U	4	t	t
MT02	MT01	2	f	f
YL01	YL02	2	f	f
YL01	BL15	4	t	t
YL02	YL01	2	f	f
YL02	YL03	2	f	f
YL03	YL02	2	f	f
YL03	YL04	2	f	f
YL04	YL03	2	f	f
YL04	YL05	2	f	f
YL05	YL04	2	f	f
YL05	YL06	2	f	f
YL06	YL05	2	f	f
YL06	YL07	1	f	f
YL07	YL06	1	f	f
YL07	YL08	2	f	f
YL08	YL07	2	f	f
YL08	YL09	3	f	f
YL09	YL08	3	f	f
YL09	YL10	2	f	f
YL10	YL09	2	f	f
YL10	YL11	3	f	f
YL11	YL10	3	f	f
YL11	YL12	2	f	f
YL11	A4	4	t	t
YL12	YL11	2	f	f
YL12	YL13	2	f	f
YL13	YL12	2	f	f
YL13	YL14	2	f	f
YL14	YL13	2	f	f
YL14	YL15	2	f	f
YL15	YL14	2	f	f
YL15	YL16	2	f	f
YL16	YL15	2	f	f
YL16	YL17	2	f	f
YL17	YL16	2	f	f
YL17	YL18	2	f	f
YL18	YL17	2	f	f
YL18	YL19	2	f	f
YL19	YL18	2	f	f
YL19	YL20	2	f	f
YL20	YL19	2	f	f
YL20	YL21	2	f	f
YL21	YL20	2	f	f
YL21	YL22	2	f	f
YL22	YL21	2	f	f
YL22	YL23	2	f	f
YL23	YL22	2	f	f
YL23	E15	4	t	t
\.


--
-- Name: line line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.line
    ADD CONSTRAINT line_pkey PRIMARY KEY (line_id);


--
-- Name: station_connection station_connection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_connection
    ADD CONSTRAINT station_connection_pkey PRIMARY KEY (source_station_id, target_station_id);


--
-- Name: station station_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station
    ADD CONSTRAINT station_pkey PRIMARY KEY (station_id);


--
-- Name: station_connection station_connection_source_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_connection
    ADD CONSTRAINT station_connection_source_station_id_fkey FOREIGN KEY (source_station_id) REFERENCES public.station(station_id);


--
-- Name: station_connection station_connection_target_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_connection
    ADD CONSTRAINT station_connection_target_station_id_fkey FOREIGN KEY (target_station_id) REFERENCES public.station(station_id);


--
-- Name: station station_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station
    ADD CONSTRAINT station_line_id_fkey FOREIGN KEY (line_id) REFERENCES public.line(line_id);


--
-- PostgreSQL database dump complete
--

\unrestrict QjIeVXC9QVQICSHYfOTteuGIVwlGccJINMpAty7goQLPrsclQeRlVFLGWPtQumW


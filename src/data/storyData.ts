import { getOriginalDocImagePath } from '../assets/assetRegistry';

export type DocGroup = 'dossier' | 'evp' | 'tools' | 'evidence';

export interface OriginalDocument {
  id: string;
  number: number;
  shortTitle: string;
  title: string;
  imagePath: string;
  group: DocGroup;
  viSupportTitle: string;
  viSupportParagraphs: string[];
}

/**
 * Đã loại bỏ các tài liệu chỉ chứa mã QR (04.png, 05.png, 11.png).
 * Toàn bộ câu đố được tương tác bằng point-and-click trực tiếp tại hiện trường.
 */
export const ORIGINAL_DOCUMENTS: OriginalDocument[] = [
  {
    id: 'DOC-01',
    number: 1,
    shortTitle: '01 • Giới thiệu vụ án',
    title: '01 • Giới thiệu vụ điều tra',
    imagePath: getOriginalDocImagePath(1),
    group: 'dossier',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'Bạn là người sáng lập nhóm điều tra hiện tượng siêu nhiên GhostRid (nhóm An Linh). Mọi người thuê bạn để tìm ra nguyên nhân, nguồn gốc của sự ám ảnh và hóa giải nó. Việc này thường đòi hỏi bạn tìm hiểu kỹ địa điểm và những người từng sống, từng chết ở đó.',
      'Từ khi đội thợ bắt đầu thi công sửa chữa trên tầng 13, nhiều báo cáo xuất hiện về những bóng người kỳ lạ. Liệu đó chỉ là ảo giác ánh sáng hay việc thi công đã đánh thức thứ gì đó từ cõi khác? Hãy mang theo máy đo EMF, lên tầng 13 và điều tra sự thật.',
      'Những việc bạn cần làm: 1. Đọc các báo cáo về những cái chết từng xảy ra trên tầng 13. 2. Xem xét lời khai của các công nhân đã nhìn thấy bóng người. 3. Dùng dụng cụ điều tra để loại trừ các vong hồn. 4. Thanh tẩy tầng 13 để các linh hồn siêu thoát.',
    ],
  },
  {
    id: 'DOC-02',
    number: 2,
    shortTitle: '02 • Hồ sơ các cái chết',
    title: '02 • Các cái chết trên tầng 13',
    imagePath: getOriginalDocImagePath(2),
    group: 'dossier',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      '*Các cái chết này đã được xác nhận độc lập qua hồ sơ lưu trữ và ngoại cảm.',
      'John và Mary Collins: Cặp vợ chồng gắn bó từ thời trung học, cùng tự sát ở phòng 1310 năm 2002 sau khi biết Mary mắc ung thư não giai đoạn cuối chỉ còn sống vài tuần. Cả hai uống thuốc ngủ cùng rượu và qua đời trong vòng tay nhau.',
      'Fargo Pepper: Nhạc công địa phương, ca sĩ chính ban nhạc Zombified Zeus, thường tiệc tùng cuối tuần ở phòng 1319. Năm 2018, Fargo tử vong vì nhiều chất kích thích; pháp y kết luận tai nạn ngoài ý muốn.',
      'Brotherhood of the Stars: Một giáo phái tận thế lập giao ước kết liễu đời mình để chờ tàu mẹ đón lên Cửu Thiên vào đêm 25/12/2018. Nhóm có 5 thành viên nhưng không phải ai cũng tự sát. Thủ lĩnh Baron Vance nổi cơn ghen khi phát hiện Goddess Athena phải lòng Brother Anott nên đã bắn chết các thành viên trong phòng 1302 rồi tự sát. Thi thể Goddess Athena không bao giờ được tìm thấy.',
      'Danh sách thành viên gồm: 1. Baron Vance • 2. Goddess Athena • 3. Brother Anott • 4. Brother Paul • 5. Brother Black.',
    ],
  },
  {
    id: 'DOC-03',
    number: 3,
    shortTitle: '03 • Lời khai nhân chứng',
    title: '03 • Những lần chạm mặt trên tầng 13',
    imagePath: getOriginalDocImagePath(3),
    group: 'dossier',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'Trey Garza: “Tôi không tin mấy chuyện ma quỷ, nhưng tôi biết mình đã thấy gì. Có hai bóng người lướt qua lại ngoài hành lang, chui từ phòng này sang phòng khác. Chúng tôi sửa tầng 13 đã ba tuần không có chuyện gì cho đến lúc bắt đầu cạy vách thạch cao. Tôi còn thấy mấy chữ kỳ lạ khắc trên tấm vách vừa tháo ra.”',
      'Alfonzo Smith: “Tầng này có ma, chắc chắn rồi. Bà ngoại tôi có căn ngoại cảm và truyền lại cho tôi một phần khả năng đó. Khi vừa gặp hai bóng người, tôi đã để tay tự viết tự động theo sự dẫn dắt của linh hồn. Kết quả thu được rất đáng chú ý.”',
      'Franklin Archer: “Tôi chưa tận mắt thấy nhưng tin đồng nghiệp. Hôm trước tôi vừa sơn xong bức tường thì hôm sau có kẻ vẽ graffiti đè lên toàn bộ chỗ tôi làm. Thật bực mình.”',
    ],
  },
  {
    id: 'DOC-06',
    number: 6,
    shortTitle: '06 • Chữ viết tự động',
    title: '06 • Chữ viết tự động của Alfonzo Smith',
    imagePath: getOriginalDocImagePath(6),
    group: 'dossier',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'scratches on wall (những vết khắc trên tường)',
      'third is first (thứ ba là thứ nhất)',
      'first is second (thứ nhất là thứ hai)',
      'second is third (thứ hai là thứ ba)',
      'a joke on my name (một trò đùa trên tên tôi)',
    ],
  },
  {
    id: 'DOC-07',
    number: 7,
    shortTitle: 'Vết khắc trên vách',
    title: 'Mảnh vách thạch cao có vết khắc (Tầng 13)',
    imagePath: getOriginalDocImagePath(7),
    group: 'evidence',
    viSupportTitle: 'Nội dung ghi trên tấm vách',
    viSupportParagraphs: [
      'Tìm thấy viết/khắc trên tấm vách thạch cao bị tháo:',
      'T  A  Y  I  S',
      'A  L  I  A  S',
      'N  E  A  R  S',
    ],
  },
  {
    id: 'DOC-08',
    number: 8,
    shortTitle: 'Ảnh chụp Graffiti',
    title: 'Chữ vẽ Graffiti trên tường hành lang (Tầng 13)',
    imagePath: getOriginalDocImagePath(8),
    group: 'evidence',
    viSupportTitle: 'Ký tự vẽ trên tường',
    viSupportParagraphs: ['xF BSFOu', 'NBSSJFE', 'cVu BSF IF', 'BOE TIF'],
  },
  {
    id: 'DOC-09',
    number: 9,
    shortTitle: 'Bản ghi âm EVP 1',
    title: 'Bản chép phiên liên lạc EVP đầu tiên',
    imagePath: getOriginalDocImagePath(9),
    group: 'evp',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'Sau một đêm ở lại tầng 13 và nhiều lần thấy hai bóng người, bạn thực hiện phiên hỏi đáp EVP:',
      'Bạn: Chào, nếu các bạn là những bóng người ở đây, tôi muốn nói chuyện... → *tiếng rít*',
      'Bạn: Các bạn có thể tạo ra một dấu hiệu hay âm thanh gì đó không? → *tiếng động lớn*',
      'Bạn: Cảm ơn. Các bạn có thể cho biết tên hoặc điều gì đó về mình không? → ...mistake... (sai lầm)',
      'Bạn: Bạn đã phạm sai lầm? Đó là điều muốn nói sao? → ...there brad cloth believer fixed hobo cook sin wifi alive...',
      'Bạn: Bạn có thể giải thích ý mình không? → *tiếng rít* → Hãy nói tiếp đi → *tiếng rít* → Giúp tôi hiểu được không? → ...yz is your guide...',
    ],
  },
  {
    id: 'DOC-10',
    number: 10,
    shortTitle: 'Bảng dụng cụ (a–z)',
    title: 'Dụng cụ điều tra siêu nhiên',
    imagePath: getOriginalDocImagePath(10),
    group: 'tools',
    viSupportTitle: 'Danh sách dụng cụ',
    viSupportParagraphs: [
      'a. crucifix (thánh giá) • b. holy water (nước thánh) • c. digital voice recorder (máy ghi âm) • d. EMF meter • d. ovilus • e. laser grid • f. motion sensor • g. blood (máu) • h. pendulum • i. ouija board (bảng cầu cơ) • j. dowsing rods • k. prayer book (sách kinh cầu) • l. rosary (tràng hạt) • m. salt (muối) • n. sage (xô thơm) • o. Palo santo • p. smoky quartz • q. candles (nến) • r. incense (nhang) • s. bell (chuông) • t. sigils (ấn ký) • u. heat camera • v. digital camera • w. Polaroid camera • x. night vision • y. spirit box • z. Trifield meter.',
    ],
  },
  {
    id: 'DOC-12',
    number: 12,
    shortTitle: 'Bản ghi âm EVP 2',
    title: 'Phiên liên lạc EVP thứ hai',
    imagePath: getOriginalDocImagePath(12),
    group: 'evp',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'Bạn khá chắc hai bóng người lẩn khuất ngoài hành lang tầng 13 là Fargo Pepper và Goddess Athena (tên ngoài giáo phái là Katie Brown). Khi gọi đúng tên họ, bạn thực hiện thêm một phiên ghi âm EVP:',
      'Bạn: Fargo và Katie, hai người có ở đây cùng tôi không? → *here* (ở đây)',
      'Bạn: Tôi chỉ muốn hiểu chuyện gì đã xảy ra với hai người. → *tragedy* (bi kịch)',
      'Bạn: Đã có một bi kịch. Hai người yêu nhau phải không? → *secret* (bí mật)',
      'Bạn: Tình yêu của hai người là bí mật? → *trapped* (bị giam giữ)',
      'Bạn: Bị giáo phái giam giữ? → *Baron*',
      'Bạn: Cô ấy bị Baron Vance giữ chân. Hai người đã làm gì? → *off the record* (không công bố)',
      'Bạn: Được thôi, giữ bí mật. Nhưng cả hai đã chết rồi, có thể kể cho tôi nghe. → *er...ay...and...you...king...kin...greed*',
      'Bạn: Tôi không rõ điều đó nghĩa là gì. Cho tôi biết phải tìm ở đâu? → *1313*',
    ],
  },
  {
    id: 'DOC-13',
    number: 13,
    shortTitle: 'Cuốn sách đỏ',
    title: 'Cuốn sách đỏ trong căn 1305 (INCANTATIONS)',
    imagePath: getOriginalDocImagePath(13),
    group: 'evidence',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'Sau khi lục soát phòng 1305, bạn tìm thấy một cuốn sách đỏ (INCANTATIONS) giấu trong ô thông gió. Bên trong có kẹp một mảnh giấy:',
      '“Chúng tôi đã bí mật thuê lại căn phòng này một thời gian để không ai biết chuyện. Tầng 13 không lý tưởng vì dễ bị bắt gặp, nhưng tầng 13 rất cần thiết cho việc chúng tôi sắp làm. Con số ấy mang ý nghĩa và sức mạnh. Chúng tôi chán cảnh giấu giếm rồi và sắp làm một việc quyết liệt. Cô ấy là tất cả với tôi. Nếu chuyện kết thúc tồi tệ, hãy tìm chiếc xe này trong nhà để xe. Biển số gồm các chữ cái sau:”',
      '- Look to the Heavenly number.',
      '- What does a pirate say?',
      '- A pool stick is called this.',
      '- My Goodness, Wow, Lord.',
      '- Mine, Killer, Honey.',
      '- Sweet, Pot, V.',
    ],
  },
  {
    id: 'DOC-14',
    number: 14,
    shortTitle: 'Đĩa than cũ',
    title: 'Chiếc xe trong nhà để xe & Đĩa than',
    imagePath: getOriginalDocImagePath(14),
    group: 'evidence',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'Bạn không mất nhiều thời gian để tìm thấy tấm biển số và chiếc Chevrolet Chevelle đời 1970 màu đen phủ đầy bụi. Một nhân viên trông xe bước lại:',
      '“Xe này nằm đây nhiều năm rồi, chắc chẳng chạy được nữa. Chìa khóa để dưới tấm chắn nắng đấy.”',
      'Bên trong xe không có gì đáng chú ý, nhưng khi mở cốp, bạn phát hiện một máy hát đĩa cũ và một chiếc đĩa than duy nhất với 4 tên bài hát:',
      '1. Summer One Day • 2. So, Me and You... • 3. Thinking • 4. King Greed',
    ],
  },
  {
    id: 'DOC-15',
    number: 15,
    shortTitle: 'Bức thư phòng 1313',
    title: 'Bức thư trong vách phòng 1313',
    imagePath: getOriginalDocImagePath(15),
    group: 'evidence',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'Ngay khi bước vào phòng 1313, bạn cảm nhận bầu không khí nặng nề đầy ác ý. Cạy mảng vách thạch cao từng bị thay thế, bạn thấy thi thể khô quắt của một người phụ nữ đang nắm chặt mảnh giấy:',
      '“Chúng tôi yêu nhau say đắm, nhưng giáo phái và Baron không buông tha cô ấy. Tôi gợi ý hai đứa dùng tà thuật triệu hồi một thứ để lật ngược tình thế. Nào ngờ nó quá hiệu nghiệm: chúng tôi đã triệu hồi một thứ tà ác (We summoned something). Thứ đó nhập vào Baron Vance khiến hắn giết cả hội rồi tự sát. Tôi kịp cứu Katie, nhưng rồi nó chuyển sang chiếm lấy Katie và buộc cô ấy tấn công tôi. Tôi buộc phải đâm cô ấy để tự vệ và giấu xác sau bức vách này để giam giữ thứ kia lại.”',
      '“Cuối cùng nó vẫn tìm được và nhập vào tôi. Tôi viết những dòng này trước khi về phòng nơi có sẵn bát thuốc tự sát, mong được ở bên Katie mãi mãi. Trước khi mất kiểm soát, tôi hỏi bảng cầu cơ cách trừ khử thứ tà linh này:”',
      'light some candles, burn some sage, recite a very specific passage from a certain prayer book, draw some sigils on the wall, cut my palm with a knife and let the blood drip down, and then ring a bell.',
    ],
  },
  {
    id: 'DOC-16',
    number: 16,
    shortTitle: 'Biên bản kết thúc',
    title: 'Thanh tẩy tầng 13 — Vụ án khép lại',
    imagePath: getOriginalDocImagePath(16),
    group: 'evidence',
    viSupportTitle: 'Bản dịch tiếng Việt',
    viSupportParagraphs: [
      'Thực thể tà ác trong phòng 1313 biết bạn sắp trừ khử nó nên điên cuồng ném đồ đạc và cào cấu, nhưng bạn giữ vững tập trung làm đúng từng bước theo bức thư của Fargo. Khi nghi thức hoàn tất, cả tòa nhà lập tức nhẹ nhõm.',
      'Ngay lúc đó, hai bóng người bước ra từ phòng 1305. Ban đầu họ đứng tách biệt, rồi chậm rãi hòa vào nhau thành một hình bóng duy nhất, thì thầm “Cảm ơn” trước khi tan thành làn khói nhẹ.',
      'Linh hồn họ đã siêu thoát, tà linh đã bị tiêu diệt, tầng 13 hoàn toàn sạch bóng ám ảnh. Bạn xuống báo tin cho quản lý và khép lại vụ án.',
    ],
  },
];

export function getOriginalDocById(docId: string): OriginalDocument | undefined {
  return ORIGINAL_DOCUMENTS.find((d) => d.id === docId);
}

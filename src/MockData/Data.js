export const mockData = {
  user: {
    name: 'Trung Phong',
    phone: '0348139449',
    email: 'trungphongtrinh678@gmail.com',
    bio: 'Xin chào, nếu bạn đang tìm kiếm những món ăn Việt thì xin chúc mừng, bạn đến đúng nơi rồi đây!',
    avatar:
      'https://cdn.pixabay.com/photo/2021/07/03/20/06/woman-6384768_1280.jpg',
  },
  recipes: [
    {
      id: '1',
      name: 'Phở Hà Nội',
      description:
        'Công thức nấu phở bò',
      time: '60 Phút',
      image:
        'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
      author: 'Quốc Anh',
      authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isFavorite: false,
      nutrition: {
        carbs: '120 gr',
        protein: '200 gr',
        calories: '500 Calo',
        fat: '50 gr',
      },
      ingredients: [
        {
          name: 'Phở',
          amount: '200 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/10/04/20/04/soup-1715309_1280.jpg',
        },
        {
          name: 'Thịt bò',
          amount: '150 gr',
          image:
            'https://cdn.pixabay.com/photo/2023/01/14/14/06/burger-7718310_1280.jpg',
        },
        {
          name: 'Xương bò',
          amount: '500 gr',
          image:
            'https://cdn.pixabay.com/photo/2022/01/19/17/56/t-bone-steak-6950611_1280.jpg',
        },
        {
          name: 'Hành tím',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2011/03/24/10/46/red-shallots-5773_1280.jpg',
        },
        {
          name: 'Gừng',
          amount: '30 gr',
          image:
            'https://cdn.pixabay.com/photo/2017/01/07/14/56/ginger-1960613_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description:
            'Đổ nước sạch vào nồi lớn, cho xương bò, hành và gừng đã nướng vào. Đun sôi và sau đó giảm lửa nhỏ, hầm trong khoảng 6-8 giờ để nước dùng ngọt và trong. Lưu ý vớt bọt thường xuyên để nước dùng trong hơn.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/cooking-736678_1280.jpg',
        },
        {
          step: 2,
          description:
            'Cho các loại gia vị (hoa hồi, thảo quả, quế, hạt ngò, bạch đậu khấu, đinh hương, hạt tiêu đen) vào túi vải hoặc lưới lọc và thả vào nồi nước dùng. Nấu thêm khoảng 1-2 giờ.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/spices-736679_1280.jpg',
        },
        {
          step: 3,
          description:
            'Sau khi nước dùng đậm đà, nêm nếm lại cho vừa ăn, vớt ra các gia vị, thêm nước mắm, muối, và đường phèn.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/kitchen-736680_1280.jpg',
        },
        {
          step: 4,
          description:
            'Nêm nếm lại cho vừa ăn. Chuẩn bị phở, thịt bò, rau thơm và thưởng thức.',
          video:
            'https://cdn.pixabay.com/photo/2017/01/31/09/30/raspberry-2023404_1280.jpg',
        },
      ],
    },
    {
      id: '2',
      name: 'Bánh Mì Pate',
      description: 'Công thức Bánh mì pate',
      time: '30 Phút',
      image:
        'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg',
      author: 'Bảo Ngọc',
      authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isFavorite: true,
      nutrition: {
        carbs: '80 gr',
        protein: '100 gr',
        calories: '400 Calo',
        fat: '40 gr',
      },
      ingredients: [
        {
          name: 'Bánh mì',
          amount: '1 ổ',
          image:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/bread-1284438_1280.jpg',
        },
        {
          name: 'Pate',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/pate-1239190_1280.jpg',
        },
        {
          name: 'Thịt nguội',
          amount: '100 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/ham-1239191_1280.jpg',
        },
        {
          name: 'Dưa leo',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/cucumber-1239192_1280.jpg',
        },
        {
          name: 'Rau mùi',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/cilantro-1239193_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description: 'Cắt đôi ổ bánh mì, phết pate lên một mặt bánh.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/sandwich-1284439_1280.jpg',
        },
        {
          step: 2,
          description: 'Xếp thịt nguội, dưa leo và rau mùi vào bánh mì.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/sandwich-1284440_1280.jpg',
        },
        {
          step: 3,
          description:
            'Thêm một chút muối, tiêu và nước mắm nếu thích. Đóng bánh lại và thưởng thức.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/sandwich-1284441_1280.jpg',
        },
      ],
    },
    {
      id: '3',
      name: 'Bún Bò Huế',
      description: 'Công thức Bún Bò Huế đậm đà hương vị miền Trung',
      time: '90 Phút',
      image:
        'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
      author: 'Minh Tuấn',
      authorAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      isFavorite: false,
      nutrition: {
        carbs: '100 gr',
        protein: '180 gr',
        calories: '600 Calo',
        fat: '60 gr',
      },
      ingredients: [
        {
          name: 'Bún',
          amount: '200 gr',
          image:
            'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
        },
        {
          name: 'Thịt bò',
          amount: '150 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/beef-1239189_1280.jpg',
        },
        {
          name: 'Xương heo',
          amount: '500 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/bones-1239188_1280.jpg',
        },
        {
          name: 'Sả',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/08/11/08/04/lemongrass-1585000_1280.jpg',
        },
        {
          name: 'Mắm ruốc',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/fermented-fish-1239194_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description:
            'Hầm xương heo với sả và mắm ruốc trong 4-6 giờ để lấy nước dùng. Vớt bọt thường xuyên để nước trong.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/cooking-736678_1280.jpg',
        },
        {
          step: 2,
          description:
            'Thêm các gia vị như ớt, tỏi, hành và dầu điều để tạo màu và mùi thơm cho nước dùng.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/spices-736679_1280.jpg',
        },
        {
          step: 3,
          description:
            'Chuẩn bị bún, thịt bò, rau thơm, giá đỗ và thưởng thức cùng nước dùng nóng.',
          video:
            'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
        },
      ],
    },
    {
      id: '4',
      name: 'Gỏi Cuốn',
      description: 'Công thức Gỏi Cuốn tươi mát, dễ làm',
      time: '20 Phút',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/spring-roll-1284442_1280.jpg',
      author: 'Thu Hà',
      authorAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      isFavorite: false,
      nutrition: {
        carbs: '50 gr',
        protein: '80 gr',
        calories: '300 Calo',
        fat: '20 gr',
      },
      ingredients: [
        {
          name: 'Bánh tráng',
          amount: '10 cái',
          image:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-paper-1284443_1280.jpg',
        },
        {
          name: 'Tôm',
          amount: '100 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/shrimp-1239195_1280.jpg',
        },
        {
          name: 'Thịt heo',
          amount: '100 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/pork-1239196_1280.jpg',
        },
        {
          name: 'Rau xà lách',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/lettuce-1239197_1280.jpg',
        },
        {
          name: 'Hẹ',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/chives-1239198_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description: 'Luộc tôm và thịt heo, sau đó thái lát mỏng.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/boiling-1239199_1280.jpg',
        },
        {
          step: 2,
          description:
            'Nhúng bánh tráng vào nước ấm, trải lên mặt phẳng, xếp rau xà lách, tôm, thịt, hẹ và cuộn chặt.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/spring-roll-1284442_1280.jpg',
        },
        {
          step: 3,
          description:
            'Pha nước chấm với tỏi, ớt, đường, nước mắm và chanh. Thưởng thức gỏi cuốn với nước chấm.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/dipping-sauce-1239200_1280.jpg',
        },
      ],
    },
    {
      id: '5',
      name: 'Cơm Tấm Sườn Nướng',
      description: 'Công thức Cơm Tấm Sườn Nướng đặc trưng Sài Gòn',
      time: '45 Phút',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
      author: 'Hoàng Long',
      authorAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      isFavorite: true,
      nutrition: {
        carbs: '150 gr',
        protein: '120 gr',
        calories: '700 Calo',
        fat: '50 gr',
      },
      ingredients: [
        {
          name: 'Cơm tấm',
          amount: '200 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
        },
        {
          name: 'Sườn heo',
          amount: '150 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/pork-ribs-1239201_1280.jpg',
        },
        {
          name: 'Nước mắm',
          amount: '30 ml',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/fish-sauce-1239202_1280.jpg',
        },
        {
          name: 'Tỏi',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/08/11/08/04/garlic-1585001_1280.jpg',
        },
        {
          name: 'Mật ong',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/honey-1239203_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description:
            'Ướp sườn heo với nước mắm, tỏi, mật ong, đường và ớt trong 2 giờ.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/marinating-1239204_1280.jpg',
        },
        {
          step: 2,
          description:
            'Nướng sườn trên than hoa hoặc lò nướng ở 200°C trong 20 phút cho đến khi vàng đều.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/grilling-1239205_1280.jpg',
        },
        {
          step: 3,
          description:
            'Dọn cơm tấm ra dĩa, đặt sườn nướng lên, thêm nước mắm và dưa chua. Thưởng thức nóng.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
        },
      ],
    },
  ],
  categories: [
    {
      id: '1',
      name: 'Phở',
      icon: 'https://cdn-icons-png.flaticon.com/128/2718/2718224.png',
      isActive: true,
    },
    {
      id: '2',
      name: 'Bánh mì',
      icon: 'https://cdn-icons-png.flaticon.com/128/3511/3511307.png',
      isActive: false,
    },
    {
      id: '3',
      name: 'Cơm rang',
      icon: 'https://cdn-icons-png.flaticon.com/128/2082/2082063.png',
      isActive: false,
    },
    {
      id: '4',
      name: 'Bún bò',
      icon: 'https://cdn-icons-png.flaticon.com/128/8060/8060549.png',
      isActive: false,
    },
    {
      id: '5',
      name: 'Gỏi cuốn',
      icon: 'https://cdn-icons-png.flaticon.com/128/5787/5787908.png',
      isActive: false,
    },
    {
      id: '6',
      name: 'Cơm tấm',
      icon: 'https://cdn-icons-png.flaticon.com/128/2082/2082063.png',
      isActive: false,
    },
  ],
  banner: {
    title: 'Phở bò là một phần của "Văn hóa Việt Nam"',
    image:
      'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
  },
  featuredByCategory: {
    1: [
      // Phở
      {
        id: '101',
        name: 'Phở bò tái',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
        time: '30 Phút',
        isFavorite: false,
      },
      {
        id: '102',
        name: 'Phở gà',
        image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52',
        time: '25 Phút',
        isFavorite: true,
      },
      {
        id: '103',
        name: 'Phở cuốn',
        image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52',
        time: '20 Phút',
        isFavorite: false,
      },
    ],
    2: [
      // Bánh mì
      {
        id: '201',
        name: 'Bánh mì thịt',
        image: 'https://images.unsplash.com/photo-1600454309261-3dc9b7597637',
        time: '15 Phút',
        isFavorite: false,
      },
      {
        id: '202',
        name: 'Bánh mì chả',
        image: 'https://images.unsplash.com/photo-1600454309261-3dc9b7597637',
        time: '15 Phút',
        isFavorite: false,
      },
      {
        id: '203',
        name: 'Bánh mì gà',
        image: 'https://images.unsplash.com/photo-1600454309261-3dc9b7597637',
        time: '20 Phút',
        isFavorite: true,
      },
    ],
    3: [
      // Cơm
      {
        id: '301',
        name: 'Cơm tấm',
        image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec',
        time: '20 Phút',
        isFavorite: false,
      },
      {
        id: '302',
        name: 'Cơm rang',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
        time: '25 Phút',
        isFavorite: false,
      },
      {
        id: '303',
        name: 'Cơm gà',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
        time: '30 Phút',
        isFavorite: false,
      },
    ],
    4: [
      // Bún
      {
        id: '401',
        name: 'Bún chả',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
        time: '35 Phút',
        isFavorite: true,
      },
      {
        id: '402',
        name: 'Bún bò Huế',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
        time: '40 Phút',
        isFavorite: false,
      },
      {
        id: '403',
        name: 'Bún đậu',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
        time: '25 Phút',
        isFavorite: false,
      },
    ],
    5: [
      // Gỏi cuốn
      {
        id: '501',
        name: 'Gỏi cuốn tôm',
        image: 'https://images.unsplash.com/photo-1625938145744-e380515399b7',
        time: '15 Phút',
        isFavorite: false,
      },
      {
        id: '502',
        name: 'Gỏi cuốn thịt',
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975',
        time: '15 Phút',
        isFavorite: false,
      },
      {
        id: '503',
        name: 'Gỏi cuốn chay',
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975',
        time: '10 Phút',
        isFavorite: true,
      },
    ],
    6: [
      // Cơm tấm
      {
        id: '601',
        name: 'Cơm tấm sườn',
        image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec',
        time: '25 Phút',
        isFavorite: false,
      },
      {
        id: '602',
        name: 'Cơm tấm bì',
        image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec',
        time: '20 Phút',
        isFavorite: true,
      },
      {
        id: '603',
        name: 'Cơm tấm đặc biệt',
        image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec',
        time: '30 Phút',
        isFavorite: false,
      },
    ],
  },
};

/* eslint-disable no-case-declarations */
import base64url from "base64url";
/**
 * 阿里云图片预处理地址生成 SDK
 * @params.format                     {number}    格式转换，参数范围：["jpg", "jpeg", "png", "bmp", "gif"]
 * @params.interlace                  {boolean}   开启渐进展示（只在 jpg、jpeg 格式有效）   1/0
 * @params.autoOrient                 {boolean}   开启自适应方向 1/0
 * @params.quality                    {number}    图片质量（固定位相对质量）1~100
 * @params.resize                     {object}    缩略方式
 * @params.resize.type                {string}    参数范围: ["percent", "m_lfit", "m_mfit", "m_pad", "m_fixed"]
 *                                                1.  percent 等比缩放(搭配 resize.percent 使用);
 *                                                2.  m_lfit  宽度固定，高度自适应 (搭配 resize.width 使用);
 *                                                3.  m_lfit  高度固定，宽度自适应 (搭配 resize.height 使用);
 *                                                4.  m_lfit  固定宽高，按长边缩放（搭配 resize.width、resize.heigh 使用);
 *                                                5.  m_mfit  固定宽高，按短边缩放（搭配 resize.width、resize.heigh 使用);
 *                                                6.  m_pad   固定宽高，缩略填充 （搭配 resize.width、resize.heigh 使用);
 *                                                7.     固定宽高，居中剪裁 （搭配 resize.width、resize.heigh 使用);
 *                                                8.  m_fixed 强制宽高         （搭配 resize.width、resize.heigh 使用);
 * @params.resize.width               {number}
 * @params.resize.height              {number}
 * @params.resize.percent             {number}
 * @params.bright                     {number}   图片亮度    -100～100
 * @params.contrast                   {number}   图片对比度   -100～100
 * @params.sharpen                    {number}   图片锐化     50～399
 * @params.blur                       {object}   图片模糊
 * @params.blur.radius                {number}   图片模糊半径   1～50
 * @params.blur.standard              {number}   图片模糊标准差 1～50
 * @params.rotate                     {number}   图片选装 1～360
 * @params.watermark                  {object}   水印
 * @params.watermark.type             {string}   水印类型: text 文字水印、image 图片水印
 * @params.watermark.transparency     {number}   水印透明度 0 ～ 99
 * @params.watermark.position         {string}   水印位置，参数范围 ["g_nw", "g_north", " g_ne", "g_west", "g_center", "g_east", "g_sw", "g_south", "g_se"]
 * @params.watermark.x                {number}   水印水平边距
 * @params.watermark.y                {number}   水印垂直边距
 * @params.watermark.text             {string}   水印文字   （文字水印类型中比传参数 ）
 * @params.watermark.textfontSize     {number}   水印文字大小（文字水印类型中比传参数）
 * @params.watermark.textColor        {string}   水印文字颜色（文字水印类型中生效，6 位数长度）
 * @params.watermark.textRotate       {number}   水印文字旋转（文字水印类型中生效， 1 ～ 360）
 * @params.watermark.textFill         {number}   水印文字铺满（文字水印类型中生效， 1/0 ）
 * @params.watermark.textShadow       {number}   水印文字阴影透明度（文字水印类型中生效， 0 ～ 100 ）
 * @params.watermark.image            {string}   水印图片路径（图片水印类型中比传参数 ）
 * @params.watermark.imagePercent     {number}   水印图片占比（水印图占主图的百分比，将利用它根据主图的大小来动态调整水印图片的大小）
 * @params.watermark.imageBright      {number}   水印图片亮度（图片水印类型中生效，-100 ～ 100）
 * @params.watermark.imageContrast    {number}   水印图片对比度（图片水印类型中生效， -100 ～ 100）
 **/

export const xOssProcessWithQuery = params => {
  const s = xOssProcess(params);
  return s ? `?x-oss-process=${s}` : "";
};

export const xOssProcess = params => {
  const vaildParams = {
    format: checkFormat(params.format),
    interlace: checkInterlace(params.format, params.interlace),
    "auto-orient": checkNumberInRang(
      params.autoOrient,
      1,
      1,
      "开启自适应方向 autoOrient",
      "/auto-orient,"
    ),
    quality: checkNumberInRang(
      params.quality,
      1,
      100,
      "图片质量 qulity",
      "/quality,q_"
    ),
    resize: checkResize(params.resize),
    bright: checkNumberInRang(
      params.bright,
      -100,
      100,
      "图片亮度 bright",
      "/bright,"
    ),
    contrast: checkNumberInRang(
      params.contrast,
      -100,
      100,
      "图片对比度 contrast",
      "/contrast,"
    ),
    sharpen: checkNumberInRang(
      params.sharpen,
      50,
      399,
      "图片锐化 sharpen",
      "/sharpen,"
    ),
    blur: checkBlur(params.blur),
    rotate: checkNumberInRang(
      params.rotate,
      1,
      360,
      "图片旋转 rotate",
      "/rotate,"
    ),
    watermark: checkWatermark(params.watermark)
  };

  const paramsFormat = Object.values(vaildParams).reduce((a, b) => a + b);
  return paramsFormat ? `image${paramsFormat}` : null;
};

const checkNumberInRang = (num, minNum, maxNum, remark, prefix = "") => {
  if (!num) {
    return "";
  }
  if (typeof num !== "number") {
    console.log(`${remark} 参数需要为数字类型。`);
    return "";
  }
  if (num < minNum || num > maxNum) {
    console.log(`${remark} 参数超出${minNum}~${maxNum} 范围。`);
    return "";
  }
  return prefix ? prefix + num : num;
};

const checkFormat = format => {
  if (format && !["jpg", "jpeg", "png", "bmp", "gif"].includes(format)) {
    console.warn("注意，不支持 " + +" 格式，所以预览图采用的还是原图格式。");
    return "";
  }
  if (format && ["webp", "tiff"].includes(format)) {
    console.warn(
      "注意，不是所有的浏览器都支持 WEBP 和 TIFF 格式，所以预览图采用的还是原图格式。"
    );
    return "";
  }
  return format ? "/format," + format : "";
};

const checkInterlace = (format, interlace) => {
  if (format && interlace && format !== "jpg") {
    console.warn(
      "渐进展示用以开启先模糊后清晰的呈现方式，仅对格式为 JPG 的图片有效。"
    );
  }
  return format === "jpg" && interlace ? "/interlace,1" : "";
};

const checkResize = resize => {
  if (!resize || typeof resize !== "object") {
    return "";
  }
  const { type, percent, width, height } = resize;
  let resizeFormat = "";
  switch (type) {
    case "percent":
      resizeFormat = checkResizePercent(percent);
      break;
    case "m_lfit":
      resizeFormat = checkResizeMLfit(width, height);
      break;
    case "m_mfit":
      resizeFormat = checkResizeMMfit(width, height);
      break;
    case "m_pad":
      resizeFormat = checkResizeMPad(width, height);
      break;
    case "m_fill":
      resizeFormat = checkResizeMFill(width, height);
      break;
    case "m_fixed":
      resizeFormat = checkResizeMFixed(width, height);
      break;
    default:
      console.warn("缩略模式不支持: " + type + "模式");
      break;
  }
  return resizeFormat;
};

const checkResizePercent = percent => {
  if (!percent) {
    console.warn("等比缩放模式下需要传递 resize.percent 参数");
    return "";
  }
  const formatPercent = Number(percent);
  if (!formatPercent || formatPercent < 1 || formatPercent > 1000) {
    console.warn("等比缩放模式 resize.percent 参数需要在 1～1000 范围");
    return "";
  }
  return `/resize,p_${formatPercent}`;
};

const checkResizeMLfit = (width, height) => {
  const formatWidth = Number(width);
  const formatHeigth = Number(height);
  if (!formatWidth && !formatHeigth) {
    console.warn("自适应缩放模式至少包含 resize.width 或 resize.height 参数");
    return "";
  }
  let formatMLfit = "/resize,m_lfit";
  if (formatWidth) {
    formatMLfit += `,w_${formatWidth}`;
  }
  if (formatHeigth) {
    formatMLfit += `,w_${formatHeigth}`;
  }
  return formatMLfit;
};

const checkResizeMMfit = (width, height) => {
  const formatWidth = Number(width);
  const formatHeigth = Number(height);
  if (!formatWidth || !formatHeigth) {
    console.warn("短边缩放模式需要包含 resize.width 与 resize.height 参数");
    return "";
  }
  return `/resize,m_mfit,w_${formatWidth},h_${formatHeigth}`;
};

const checkResizeMPad = (width, height) => {
  const formatWidth = Number(width);
  const formatHeigth = Number(height);
  if (!formatWidth || !formatHeigth) {
    console.warn("缩略填充模式需要包含 resize.width 与 resize.height 参数");
    return "";
  }
  return `/resize,m_pad,w_${formatWidth},h_${formatHeigth}`;
};

const checkResizeMFill = (width, height) => {
  const formatWidth = Number(width);
  const formatHeigth = Number(height);
  if (!formatWidth || !formatHeigth) {
    console.warn("居中裁剪模式需要包含 resize.width 与 resize.height 参数");
    return "";
  }
  return `/resize,m_fill,w_${formatWidth},h_${formatHeigth}`;
};

const checkResizeMFixed = (width, height) => {
  const formatWidth = Number(width);
  const formatHeigth = Number(height);
  if (!formatWidth || !formatHeigth) {
    console.warn("强制宽高模式需要包含 resize.width 与 resize.height 参数");
    return "";
  }
  return `/resize,m_fixed,w_${formatWidth},h_${formatHeigth}`;
};

const checkBlur = blur => {
  if (typeof blur !== "object") {
    return "";
  }
  const { radius, standard } = blur;
  if (!radius || !standard) {
    return "";
  }
  const formatRadius = checkNumberInRang(radius, 1, 50, "图片模糊半径", "r_");
  const formatStandard = checkNumberInRang(
    standard,
    1,
    50,
    "图片模糊标准差",
    "s_"
  );
  if (!formatRadius || !formatStandard) {
    return "";
  }
  return `/blur,${formatRadius},${formatStandard}`;
};

const checkWatermark = watermark => {
  if (!watermark || typeof watermark !== "object") {
    return "";
  }
  const { type, transparency, position, x, y } = watermark;
  let watermarkFormat = null;
  switch (type) {
    case "text":
      watermarkFormat = checkWatermarkText(watermark);
      break;
    case "image":
      watermarkFormat = checkWatermarkImage(watermark);
      break;
    default:
      console.warn("水印模式不支持: " + type + "模式");
      break;
  }

  if (watermarkFormat) {
    // 水印透明度
    const formatTransparency = checkNumberInRang(
      transparency,
      0,
      99,
      "水印透明度 watermark.transparency",
      "t_"
    );
    formatTransparency && (watermarkFormat += `,${formatTransparency}`);
    // 水印位置
    if (
      position &&
      [
        "g_nw",
        "g_north",
        "g_ne",
        "g_west",
        "g_center",
        "g_east",
        "g_sw",
        "g_south",
        "g_se"
      ].includes(position)
    ) {
      watermarkFormat += `,${position}`;
    } else {
      !position && console.warn("水印位置不在参数范围内");
    }
    // 水印偏移值
    const formatWatermarkX = Number(x) ? Number(x) : 1;
    const formatWatermarkY = Number(y) ? Number(y) : 1;
    watermarkFormat += `,x_${formatWatermarkX},y_${formatWatermarkY}`;
    return watermarkFormat;
  }
  return watermarkFormat;
};

const checkWatermarkText = watermark => {
  const {
    text,
    textfontSize,
    textColor,
    textRotate,
    textFill,
    textShadow
  } = watermark;
  if (!text || !textfontSize) {
    console.warn("文字水印下 text、textfontSize 为必须传字段");
    return "";
  }
  // 水印文字颜色
  let formatWatermarkText = `/watermark,text_${base64url(
    text
  )},size_${textfontSize}`;
  if (textColor && textColor.indexOf("#") === 0 && textColor.length === 7) {
    formatWatermarkText += `,color_${textColor.substr(1)}`;
  }
  // 水印文字旋转
  let formatTextRotate = checkNumberInRang(
    textRotate,
    1,
    360,
    "水印文字旋转 watermark.textRotate",
    "rotate_"
  );
  // 水印文字铺满
  formatTextRotate && (formatWatermarkText += `,${formatTextRotate}`);
  let formatTextFill = checkNumberInRang(
    textFill,
    0,
    1,
    "水印文字铺满 watermark.textFill",
    "fill_"
  );
  formatTextFill && (formatWatermarkText += `,${formatTextFill}`);
  // 水印文字阴影
  let formatTextShadow = checkNumberInRang(
    textShadow,
    0,
    100,
    "水印文字阴影透明度 watermark.textShadow",
    "shadow_"
  );
  formatTextShadow && (formatWatermarkText += `,${formatTextShadow}`);

  return formatWatermarkText;
};

const checkWatermarkImage = watermark => {
  const { image, imagePercent, imageBright, imageContrast } = watermark;
  if (!image) {
    console.warn("图片水印下 image 为必须传字段");
    return "";
  }
  let formatImagePercent = checkNumberInRang(
    imagePercent,
    1,
    100,
    "水印图片占比 watermark.imagePercent",
    "P_"
  );
  let formatImageBright = checkNumberInRang(
    imageBright,
    -100,
    100,
    "水印图片亮度 watermark.imageBright"
  );
  let formatImageContrast = checkNumberInRang(
    imageContrast,
    -100,
    100,
    "水印图片对比度 watermark.imageContrast"
  );
  let formatXOssProcessPrefix = image + "?x-oss-process=image";
  let formatWatermarkImage = "";
  if (formatImagePercent || formatImageBright || formatImageContrast) {
    formatImagePercent &&
      (formatXOssProcessPrefix += `/resize,${formatImagePercent}`);
    formatImageBright &&
      (formatXOssProcessPrefix += `/bright,${formatImageBright}`);
    formatImageContrast &&
      (formatXOssProcessPrefix += `/contrast,${formatImageContrast}`);
    formatWatermarkImage += `${formatXOssProcessPrefix}`;
  }
  formatWatermarkImage = `/watermark,image_${base64url(formatWatermarkImage)}`;
  return formatWatermarkImage;
};

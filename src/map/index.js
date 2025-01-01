// 所有label、value映射
import {errorMap} from "@/map/error.js";
import {categoryMap, headerMap, languageMap, mediaMap, statusMap} from "@/map/template.js";
import {getLabel} from '@/tools'

export const getStatusLabel = (status) => getLabel(statusMap, status);
export const getCategoryLabel = (category) => getLabel(categoryMap, category);
export const getLangLabel = (language) => getLabel(languageMap, language);
export const getHeaderLabel = (header) => getLabel(headerMap, header);
export const getMediaLabel = (media) => getLabel(mediaMap, media);
export const getErrorLabel = (error) => getLabel(errorMap, error);

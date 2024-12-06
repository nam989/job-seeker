import { Injectable } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class XmlParserService {
  async parseSkills(xmlData: string): Promise<string[]> {
    try {
      const result = await parseStringPromise(xmlData);
      return result.skills?.skill?.map((dataItem: any) => dataItem) || [];
    } catch (error) {
      console.error('Error parsing XML:', error);
      return [];
    }
  }
}

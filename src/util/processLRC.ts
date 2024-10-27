export const lrcTimestampRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

// Convert LRC lyrics to timestamps and processed lines
export const processLrcLyrics = (lyrics: string) => {
    const lines = lyrics.split("\n");
    const timestamps: number[] = [];
    const processedLines: string[] = [];
  
    lines.forEach(line => {
      const match = lrcTimestampRegex.exec(line);
      if (match) {
        timestamps.push((parseInt(match[1]) * 60 * 1000 + parseInt(match[2]) * 1000 + parseInt(match[3])*10) / 1000);
        processedLines.push(line.replace(lrcTimestampRegex, "").trim());
      }
    });
  
    return { timestamps, processedLines };
  }
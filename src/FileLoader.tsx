import { ChangeEvent, useCallback, useState } from "react";
import FileDisplay from "./FileDisplay/FileDisplay";
import styles from "./FileLoader.module.css";
import ActionConfigContext from "./actionConfigContext";
import type { ActionConfig } from "./types";

function FileLoader() {
  const [actionConfig, setActionConfig] = useState<ActionConfig | null>(null);
  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target?.files?.[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setActionConfig(
            JSON.parse(
              (fileReader.result as string) || '{"actions": []}'
            ) as ActionConfig
          );
        };
        fileReader.readAsText(file);
      }
    },
    [setActionConfig]
  );
  return (
    <>
      <div className={styles.mainContainer}>
        <label htmlFor="fileupload">Upload file</label>
        <input name="fileupload" type="file" onChange={onFileChange} />
        <textarea
          readOnly
          rows={5}
          value={JSON.stringify(actionConfig)}
        ></textarea>
      </div>
      <ActionConfigContext.Provider value={{ actionConfig, setActionConfig }}>
        <FileDisplay />
      </ActionConfigContext.Provider>
    </>
  );
}

export default FileLoader;

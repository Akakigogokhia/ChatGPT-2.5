import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import '../chat.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { hybrid } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Copy from '@mui/icons-material/ContentPaste';
import Check from '@mui/icons-material/Check';
import ClipboardJS from 'clipboard';
import './response.css';

function Response({ type, answer, setTyped, index }) {
  const regex = /(```[a-z]*[\s\S]*?```)/gi;
  const blocks = answer?.split(regex).filter((str) => str.trim());
  const [copied, setCopied] = useState(false);

  const handleCopy = (code) => {
    setCopied(true);

    new ClipboardJS('#copy', {
      text: () => code,
    });

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const seperate = (string) => {
    if (string) {
      const fullCode = string.replace(/`/g, '');
      let language = fullCode.split('\n')[0];
      language = language.length > 30 ? '' : language;
      const code =
        language.length < 30 ? fullCode.substring(language.length) : fullCode;

      return { code, language };
    }
  };

  const RenderAnswer = () => {
    return blocks?.map((block, idx) => {
      if (block[0] === '`') {
        const { code, language } = seperate(block);
        return (
          <div className='code' key={idx}>
            <div className='code_header'>
              <div>{language}</div>
              <div
                className='code_copy'
                id='copy'
                onClick={() => handleCopy(code)}
              >
                {copied ? (
                  <Check className='copy' />
                ) : (
                  <Copy className='copy' />
                )}
                <span>Copy code</span>
              </div>
            </div>
            <SyntaxHighlighter
              language={language}
              className='codeH'
              style={hybrid}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        return (
          <pre key={idx}>
            <div>{block}</div>
          </pre>
        );
      }
    });
  };

  return (
    <div className='response'>
      {type ? (
        <TypeAnimation
          sequence={[answer, () => setTyped(true)]}
          speed={90}
          wrapper='pre'
          cursor={true}
          key={index}
        />
      ) : (
        <RenderAnswer />
      )}
    </div>
  );
}

export default Response;

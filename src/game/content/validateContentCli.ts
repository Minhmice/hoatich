import { pathToFileURL } from 'node:url';
import process from 'node:process';
import { contentBundle } from './index';
import { validateContent } from './validateContent';

export function runCli(bundle = contentBundle): number {
  const issues = validateContent(bundle);
  if (issues.length > 0) {
    console.error(`Content validation failed with ${issues.length} issue(s):`);
    for (const issue of issues) {
      console.error(`- [${issue.code}] ${issue.entityId}: ${issue.message}`);
    }
    return 1;
  }

  console.log(
    `Content valid: ${bundle.flowers.length} flowers, ${bundle.customers.length} customers, ${bundle.orders.length} orders, ${bundle.dialogue.length} dialogue nodes.`,
  );
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const exitCode = runCli();
  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}

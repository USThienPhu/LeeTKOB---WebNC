import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { runSandboxCode } from '../../src/sandbox/runner.js';

describe('Sandbox Security Minimums (Criterion 2)', () => {
  const attacksDir = path.resolve(__dirname, '../sandbox_attacks');

  it('1. should block network connections', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '01_no_network.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({ sourceCode: code });
    expect(result.stdout).not.toContain('BREACH_NETWORK');
    expect(result.status).not.toBe('ACCEPTED');
  });

  it('2. should enforce CPU time limit', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '02_cpu_limit.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({
      sourceCode: code,
      limits: {
        cpuTimeLimitMs: 1000,
        wallClockLimitMs: 3000,
        memoryLimitMb: 256,
        outputLimitKb: 64,
        pidsLimit: 64,
      },
    });
    expect(result.status).toBe('TIME_LIMIT_EXCEEDED');
  });

  it('3. should enforce wall-clock limit and kill container on sleep', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '03_wall_time.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({
      sourceCode: code,
      limits: {
        cpuTimeLimitMs: 2000,
        wallClockLimitMs: 2000,
        memoryLimitMb: 256,
        outputLimitKb: 64,
        pidsLimit: 64,
      },
    });
    expect(result.status).toBe('TIME_LIMIT_EXCEEDED');
  });

  it('4. should enforce memory limit on allocation and readback', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '04_memory_limit.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({
      sourceCode: code,
      limits: {
        cpuTimeLimitMs: 2000,
        wallClockLimitMs: 4000,
        memoryLimitMb: 256,
        outputLimitKb: 64,
        pidsLimit: 64,
      },
    });
    expect(result.status).toBe('MEMORY_LIMIT_EXCEEDED');
  });

  it('5. should block fork bombs via pids limit', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '05_process_limit.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({
      sourceCode: code,
      limits: {
        cpuTimeLimitMs: 2000,
        wallClockLimitMs: 3000,
        memoryLimitMb: 256,
        outputLimitKb: 64,
        pidsLimit: 32,
      },
    });
    expect(result.status).not.toBe('ACCEPTED');
  });

  it('6. should enforce output size limit', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '06_output_limit.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({
      sourceCode: code,
      limits: {
        cpuTimeLimitMs: 2000,
        wallClockLimitMs: 3000,
        memoryLimitMb: 256,
        outputLimitKb: 64,
        pidsLimit: 64,
      },
    });
    expect(result.status).toBe('OUTPUT_LIMIT_EXCEEDED');
  });

  it('7. should run as non-root user', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '07_non_root.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({ sourceCode: code });
    expect(result.stdout).not.toContain('BREACH_RUNNING_AS_ROOT');
  });

  it('8. should not mount docker socket or host filesystem', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '08_no_docker_socket.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({ sourceCode: code });
    expect(result.stdout).not.toContain('BREACH_DOCKER_SOCKET_FOUND');
  });

  it('9. should not expose model API keys or secrets', async () => {
    const code = fs.readFileSync(
      path.join(attacksDir, '09_no_secrets.cpp'),
      'utf-8'
    );
    const result = await runSandboxCode({ sourceCode: code });
    expect(result.stdout).not.toContain('BREACH_SECRET_FOUND');
  });
});

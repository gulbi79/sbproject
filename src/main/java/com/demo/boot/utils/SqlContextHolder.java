package com.demo.boot.utils;

public class SqlContextHolder {
	public static final ThreadLocal<Boolean> THREAD_LOCAL_SQLYN = ThreadLocal.withInitial(() -> false);
	public static final ThreadLocal<String> THREAD_LOCAL_SQL = ThreadLocal.withInitial(() -> "");
}
